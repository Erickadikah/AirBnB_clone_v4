$(function () {
  const amenities = [];
  $('input[type="checkbox"]').change(function () {
    const id = $(this).attr('data-id');
    const name = $(this).attr('data-name');
    if (this.checked) {
      amenities.push({ name: name, id: id });
    } else {
      const index = amenities.findIndex(function (d) {
        return d.id === id;
      });
      if (index !== -1) {
        amenities.splice(index, 1);
      }
    }
    const amenityNames = amenities
      .map(function (d) {
        return d.name.replace(':', '');
      })
      .join(', ');
    $('.amenities h4').text(amenityNames);
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    method: 'GET',
    success: function (data) {
      if (data.status.toLowerCase() === 'ok') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    }
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({}),
    dataType: 'json',
    success: function (data) {
      const placeSection = $('section.places');

      for (const place of data) {
        const article = `
        <article>
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">
            ${place.max_guest} Guest${place.max_guest > 1 ? 's' : ''}
            </div>
            <div class="number_rooms">
            ${place.number_rooms} Bedroom${place.number_rooms > 1 ? 's' : ''}
            </div>
            <div class="number_bathrooms">
            ${place.number_bathrooms} Bathroom${
          place.number_bathrooms > 1 ? 's' : ''
        }
            </div>
          </div>
          <div class="description">
            ${place.description}
          </div>
      </article>
      `;
        placeSection.append(article);
      }
    }
  });
});
