$(document).ready(function() {
    axios.get('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(response => {
            const categories = response.data.categories;
            categories.forEach(category => {
                $('#category-list').append(`
                <div  class="col-md-3">
                    <div class="menu-item">
                        <img src="${category.strCategoryThumb}" alt="${category.strCategory}" width="200" height="200">
                        <h5>${category.strCategory}</h5>
                        <a href="category.html?category-name=${encodeURIComponent(category.strCategory)}" class="btn btn-outline-warning">View</a>
                    </div>
                </div> 
                                        
                `);
            });
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
    });
});

$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('category-name');
    if (categoryName) {
        $('#category-title').text(categoryName);
        $('#ol').text(categoryName);
        axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(categoryName)}`)
            .then(response => {
                const meals = response.data.meals;
                if (meals && meals.length > 0) {
                    meals.forEach(meal => {
                        $('#meal-list').append(`
                            <div class="col-md-3">
                                <div class="menu-item">
                                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="200" height="200">
                                    <h5>${meal.strMeal}</h5>
                                    <a href="detail.html?meal-id=${meal.idMeal}" class="btn btn-outline-warning">View Details</a>
                                </div>
                            </div> 
                        `);
                    });
                } else {
                    $('#meal-list').append('<p style="color: white;>No meals found for this category.</p>');
                }
            })
            .catch(error => {
                console.error('Error fetching meals:', error);
                $('#meal-list').append('<p style="color: white;">Error fetching meals. Please try again later.</p>');
            });
    } else {
        $('#meal-list').append('<p style="color: white;">No category specified in the URL.</p>');
    }
});

$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const mealId = urlParams.get('meal-id');
    axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => {
            const meal = response.data.meals[0]; 
            
            $('#meal-title').text(meal.strMeal);
            $('#meal-image').attr('src', meal.strMealThumb);
            $('#meal-description').text(meal.strInstructions);
        
            let ingredients = '';
            for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                if (ingredient && ingredient.trim()) {
                    ingredients += `<li>${measure} ${ingredient}</li>`;
                }
            }
            $('#meal-ingrediant').html(`<ul>${ingredients}</ul>`);
            
            const youtubeUrl = meal.strYoutube ? meal.strYoutube.replace("watch?v=", "embed/") : '';
            if (youtubeUrl) {
                $('#meal-video').append(`<iframe height="315" src="${youtubeUrl}" frameborder="0" allowfullscreen></iframe>`);
            } else {
                $('#meal-video').append(`<img src="${meal.strMealThumb}" alt="No video available" width="500" height="315" />`);
            }
        })
        .catch(error => {
            console.error('Error fetching meal details:', error);
        });
});

