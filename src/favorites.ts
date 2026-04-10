export function Favorites(): string {
  return `
    <div class="container">
      <div class="box left">
        <div class="restaurant-list">

          <div class="card">
            <img src="https://via.placeholder.com/100" alt="restaurang">
            <div class="card-text">
              
              <div class="card-header">
                <h2>Pizza Maestro</h2>
                <span class="rating">4.5</span>
              </div>

              <p>Restaurang, Stockholm</p>
              <hr>

              <div class="diet-list">
                <span class="diet">Vegan</span>
                <span class="diet">Halal</span>
                <span class="diet">Gluten-Free</span>
              </div> 

              <p>
                Nice food and cozy atmosphere. Full options for vegans, halal and so much more.
              </p>
            </div>
          </div>

        </div>
      </div>

      <div class="box right">
        <h1>Box2</h1>
      </div>
    </div>
  `;
}