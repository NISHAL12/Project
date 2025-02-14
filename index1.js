let title = document.querySelector("#title");
        let ingredient = document.querySelector("#ingredient");
        let instruction = document.querySelector("#instruction");
        let cuisine = document.querySelector("#cuisine");
        let image = document.querySelector("#image");
        let container = document.querySelector("#container");
        let editIndex = document.querySelector("#edit-index");
        let search = document.querySelector("#search");
        let searchBtn = document.querySelector("#search-btn");
        let filter = document.querySelector("#filter");

        let recipeArray = JSON.parse(localStorage.getItem("recipeData")) || [];

        function populateFilterOptions() {
            let cuisines = [...new Set(recipeArray.map(recipe => recipe.cuisine))];
            filter.innerHTML = '<option value="">Filter by Cuisine</option>' + cuisines.map(cuisine => `<option value="${cuisine}">${cuisine}</option>`).join('');
        }

        function showData() {
            container.innerHTML = "";
            let searchText = search.value.toLowerCase();
            let filterValue = filter.value;
            
            let filteredRecipes = recipeArray.filter(recipe =>
                recipe.title.toLowerCase().includes(searchText) &&
                (filterValue === "" || recipe.cuisine === filterValue)
            );

            filteredRecipes.forEach((recipe, index) => {
                let card = document.createElement("div");
                card.classList.add("recipe-card");

                let titleElem = document.createElement("h2");
                titleElem.innerText = recipe.title;

                let ingredientElem = document.createElement("p");
                ingredientElem.innerText = `Ingredients: ${recipe.ingredient}`;

                let instructionElem = document.createElement("p");
                instructionElem.innerText = `Instructions: ${recipe.instruction}`;

                let cuisineElem = document.createElement("p");
                cuisineElem.innerText = `Cuisine: ${recipe.cuisine}`;

                let imageElem = document.createElement("img");
                imageElem.src = recipe.image;
                imageElem.alt = "Recipe Image";
                imageElem.style.width = "50%";
                imageElem.style.height = "400px";

                let edit = document.createElement("button");
                edit.textContent = "Edit";

                let del = document.createElement("button");
                del.textContent = "Delete";

                edit.addEventListener("click", () => {
                    search.value = "";
                    showData();
                    title.value = recipe.title;
                    ingredient.value = recipe.ingredient;
                    instruction.value = recipe.instruction;
                    cuisine.value = recipe.cuisine;
                    image.value = recipe.image;
                    editIndex.value = index;
                });

                del.addEventListener("click", () => {
                    recipeArray = recipeArray.filter((_, i) => i !== index);
                    localStorage.setItem("recipeData", JSON.stringify(recipeArray));
                    showData();
                    populateFilterOptions();
                });

                card.append(titleElem, ingredientElem, instructionElem, cuisineElem, imageElem, edit, del);
                container.append(card);
            });
        }

        document.querySelector("#recipe-form").addEventListener("submit", (event) => {
            event.preventDefault();

            if (title.value && ingredient.value && instruction.value && cuisine.value && image.value) {
                let index = editIndex.value;
                if (index !== "") {
                    recipeArray[index] = {
                        title: title.value,
                        ingredient: ingredient.value,
                        instruction: instruction.value,
                        cuisine: cuisine.value,
                        image: image.value
                    };
                    editIndex.value = "";
                } else {
                    recipeArray.push({
                        title: title.value,
                        ingredient: ingredient.value,
                        instruction: instruction.value,
                        cuisine: cuisine.value,
                        image: image.value
                    });
                }

                localStorage.setItem("recipeData", JSON.stringify(recipeArray));
                showData();
                populateFilterOptions();

                title.value = "";
                ingredient.value = "";
                instruction.value = "";
                cuisine.value = "";
                image.value = "";
            } else {
                alert("Please fill in all fields.");
            }
        });

        searchBtn.addEventListener("click", showData);
        filter.addEventListener("change", showData);

        showData();
        populateFilterOptions();