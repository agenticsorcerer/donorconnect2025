// API Base URL
const API_BASE_URL = '/api';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Search Donors page loaded');
  
  // Initialize nice-select
  if (typeof $ !== 'undefined' && $.fn.niceSelect) {
    $('.nice_select').niceSelect();
  }
  
  // Load hospitals
  loadHospitals();
  
  // Initialize form
  initializeSearchForm();
});

// Load hospitals from API
async function loadHospitals() {
  try {
    const response = await fetch(`${API_BASE_URL}/preferred-hospitals/`);
    
    if (!response.ok) {
      throw new Error(`Failed to load hospitals: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const hospitalSelect = document.getElementById('searchHospital');
    
    if (!hospitalSelect) {
      console.error('Hospital select element not found');
      return;
    }
    
    let hospitals = [];
    if (Array.isArray(data)) {
      hospitals = data;
    } else if (data.results && Array.isArray(data.results)) {
      hospitals = data.results;
    }
    
    hospitals.forEach(hospital => {
      const option = document.createElement('option');
      option.value = hospital.preferred_hospital_id;
      const displayName = hospital.hospital_name 
        ? `${hospital.hospital_name}${hospital.city_name ? ' - ' + hospital.city_name : ''}`
        : `Hospital ${hospital.preferred_hospital_id}`;
      option.textContent = displayName;
      hospitalSelect.appendChild(option);
    });
    
    // Reinitialize nice-select
    if (typeof $ !== 'undefined' && $.fn.niceSelect) {
      $('#searchHospital').niceSelect('update');
    }
    
    console.log(`Loaded ${hospitals.length} hospitals successfully`);
  } catch (error) {
    console.error('Error loading hospitals:', error);
  }
}

// Initialize search form
function initializeSearchForm() {
  const form = document.getElementById('searchDonorsForm');
  const resetBtn = document.getElementById('resetBtn');
  
  if (!form) {
    console.error('Search form not found');
    return;
  }
  
  // Handle form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    await searchDonors();
  });
  
  // Handle reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      form.reset();
      if (typeof $ !== 'undefined' && $.fn.niceSelect) {
        $('#searchBloodGroup').niceSelect('update');
        $('#searchHospital').niceSelect('update');
      }
      document.getElementById('searchResults').innerHTML = '';
    });
  }
}

// Search donors
async function searchDonors() {
  const city = document.getElementById('searchCity').value.trim();
  const bloodGroup = document.getElementById('searchBloodGroup').value;
  const hospitalId = document.getElementById('searchHospital').value;
  const resultsDiv = document.getElementById('searchResults');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const searchBtn = document.getElementById('searchBtn');
  
  // Show loading
  loadingIndicator.style.display = 'block';
  resultsDiv.innerHTML = '';
  searchBtn.disabled = true;
  searchBtn.innerHTML = 'Searching... <span><i class="fas fa-spinner fa-spin"></i></span>';
  
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (bloodGroup) params.append('blood_group', bloodGroup);
    if (hospitalId) params.append('preferred_hospital_id', hospitalId);
    params.append('availability', 'true'); // Only show available donors
    
    const url = `${API_BASE_URL}/donor-profiles/search/?${params.toString()}`;
    console.log('Searching donors:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to search donors: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Search results:', data);
    
    // Hide loading
    loadingIndicator.style.display = 'none';
    searchBtn.disabled = false;
    searchBtn.innerHTML = 'Search Donors <span><i class="fas fa-search"></i></span>';
    
    // Display results
    if (data.success && data.results && data.results.length > 0) {
      displayDonorResults(data.results);
    } else {
      displayNoResults();
    }
  } catch (error) {
    console.error('Error searching donors:', error);
    loadingIndicator.style.display = 'none';
    searchBtn.disabled = false;
    searchBtn.innerHTML = 'Search Donors <span><i class="fas fa-search"></i></span>';
    resultsDiv.innerHTML = `
      <div class="alert alert-danger">
        <h5>Error</h5>
        <p>Failed to search donors. Please try again.</p>
        <p class="text-muted">${error.message}</p>
      </div>
    `;
  }
}

// Display donor results
function displayDonorResults(donors) {
  const resultsDiv = document.getElementById('searchResults');
  
  let html = `
    <div class="row mb-4">
      <div class="col-12">
        <h4>Found ${donors.length} Donor(s)</h4>
      </div>
    </div>
    <div class="row">
  `;
  
  donors.forEach(donor => {
    const avatarUrl = donor.user_avatar || 'assets/images/default-avatar.png';
    const userName = donor.user_name || 'Anonymous';
    const userEmail = donor.user_email || 'N/A';
    const userPhone = donor.user_phone || 'N/A';
    const userAge = donor.user_age || 'N/A';
    const userGender = donor.user_gender || 'N/A';
    // Get blood group from donor profile (should be included in serializer)
    const bloodGroup = donor.blood_group || 'N/A';
    console.log('Donor blood group:', bloodGroup, 'Full donor object:', donor);
    const city = donor.city || 'N/A';
    const hospitalName = donor.hospital_name || 'Not specified';
    const donationType = donor.donation_type_name || 'N/A';
    const donationFee = donor.donation_fee ? `PKR ${donor.donation_fee}` : 'Free';
    const availability = donor.availability ? 'Available' : 'Not Available';
    const availabilityClass = donor.availability ? 'available' : 'unavailable';
    
    html += `
      <div class="col-md-6 col-lg-4">
        <div class="donor-card">
          <div class="d-flex align-items-start mb-3">
            <img src="${avatarUrl}" alt="${userName}" class="donor-avatar me-3" onerror="this.src='assets/images/default-avatar.png'">
            <div class="flex-grow-1">
              <h5 class="mb-1">${userName}</h5>
              <p class="text-muted mb-1 small">
                <i class="fas fa-envelope"></i> ${userEmail}
              </p>
              <p class="text-muted mb-0 small">
                <i class="fas fa-phone"></i> ${userPhone}
              </p>
            </div>
          </div>
          
          <div class="mb-3 text-center">
            <span class="blood-group-badge">${bloodGroup}</span>
            <span class="availability-badge ${availabilityClass} ms-2">${availability}</span>
          </div>
          
          <div class="donor-details">
            <p class="mb-2">
              <i class="fas fa-map-marker-alt text-primary"></i> 
              <strong>City:</strong> ${city}
            </p>
            <p class="mb-2">
              <i class="fas fa-hospital text-primary"></i> 
              <strong>Hospital:</strong> ${hospitalName}
            </p>
            <p class="mb-2">
              <i class="fas fa-user text-primary"></i> 
              <strong>Age:</strong> ${userAge} years | <strong>Gender:</strong> ${userGender}
            </p>
            <p class="mb-2">
              <i class="fas fa-heart text-primary"></i> 
              <strong>Donation Type:</strong> ${donationType}
            </p>
            <p class="mb-0">
              <i class="fas fa-money-bill-wave text-primary"></i> 
              <strong>Fee:</strong> ${donationFee}
            </p>
          </div>
          
          <div class="mt-3 text-center">
            <button class="btn btn-primary btn-sm" onclick="contactDonor('${userEmail}', '${userPhone}')">
              <i class="fas fa-envelope"></i> Contact Donor
            </button>
          </div>
        </div>
      </div>
    `;
  });
  
  html += `</div>`;
  resultsDiv.innerHTML = html;
}

// Display no results message
function displayNoResults() {
  const resultsDiv = document.getElementById('searchResults');
  resultsDiv.innerHTML = `
    <div class="no-results">
      <i class="fas fa-search fa-3x mb-3 text-muted"></i>
      <h4>No Donors Found</h4>
      <p>Try adjusting your search criteria or check back later.</p>
    </div>
  `;
}

// Contact donor function
function contactDonor(email, phone) {
  if (email && email !== 'N/A') {
    window.location.href = `mailto:${email}?subject=Donation Request`;
  } else if (phone && phone !== 'N/A') {
    window.location.href = `tel:${phone}`;
  } else {
    alert('Contact information not available for this donor.');
  }
}

