// API Base URL - adjust if needed
const API_BASE_URL = '/api';

// Initialize form on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Page loaded, initializing form...');
  
  // Function to initialize nice-select dropdowns
  function initNiceSelect() {
    if (typeof $ !== 'undefined' && $.fn.niceSelect) {
      // Initialize all nice-select dropdowns
      $('.nice_select').niceSelect();
      console.log('Nice-select initialized for all dropdowns');
      
      // Double-check gender dropdown specifically
      const genderSelect = $('#gender');
      if (genderSelect.length) {
        // Check if nice-select wrapper exists
        if (!genderSelect.next('.nice-select').length) {
          console.log('Gender dropdown not initialized, reinitializing...');
          genderSelect.niceSelect();
        } else {
          console.log('Gender dropdown is properly initialized');
        }
      } else {
        console.error('Gender select element not found!');
      }
      
      return true;
    } else {
      console.warn('jQuery or nice-select not available yet');
      return false;
    }
  }
  
  // Try to initialize immediately
  let initialized = initNiceSelect();
  
  // If not initialized, retry after a short delay
  if (!initialized) {
    setTimeout(() => {
      initNiceSelect();
    }, 100);
  }
  
  initializeForm();
  
  // Load dropdowns after a short delay to ensure nice-select is initialized
  setTimeout(() => {
    console.log('Loading roles, hospitals, and donation types...');
    loadRoles();
    loadHospitals();
    loadDonationTypes();
    
    // Final check and reinitialize gender if needed
    if (typeof $ !== 'undefined' && $.fn.niceSelect) {
      const genderSelect = $('#gender');
      if (genderSelect.length) {
        const niceSelectWrapper = genderSelect.next('.nice-select');
        if (!niceSelectWrapper.length) {
          console.log('Gender dropdown still not initialized, forcing initialization...');
          genderSelect.niceSelect();
          
          // Verify it was created
          setTimeout(() => {
            const wrapper = genderSelect.next('.nice-select');
            if (wrapper.length) {
              console.log('✓ Gender dropdown successfully initialized');
            } else {
              console.error('✗ Gender dropdown failed to initialize - checking DOM...');
              console.log('Gender select element:', genderSelect[0]);
              console.log('Gender select parent:', genderSelect.parent());
            }
          }, 100);
        } else {
          // Update it to ensure it's working
          genderSelect.niceSelect('update');
          console.log('✓ Gender dropdown verified and updated');
        }
      } else {
        console.error('Gender select element not found in DOM!');
      }
    }
  }, 300);
  
  // Retry loading roles after 1 second if they didn't load
  setTimeout(() => {
    const roleSelect = document.getElementById('role_id');
    if (roleSelect && roleSelect.options.length <= 1) {
      console.log('Roles not loaded, retrying...');
      loadRoles();
    }
  }, 1000);
  
  // Final safety check for gender dropdown after 1.5 seconds
  setTimeout(() => {
    if (typeof $ !== 'undefined' && $.fn.niceSelect) {
      const genderSelect = $('#gender');
      const genderElement = document.getElementById('gender');
      
      if (genderElement) {
        const niceSelectWrapper = genderSelect.next('.nice-select');
        if (!niceSelectWrapper.length) {
          console.warn('Gender dropdown still not showing - attempting manual fix...');
          
          // Try destroying and recreating
          try {
            genderSelect.niceSelect('destroy');
          } catch(e) {
            console.log('No existing nice-select to destroy');
          }
          
          // Force reinitialize
          genderSelect.niceSelect();
          
          // Check again after a moment
          setTimeout(() => {
            const wrapper = genderSelect.next('.nice-select');
            if (wrapper.length) {
              console.log('✓ Gender dropdown fixed and now visible');
            } else {
              console.error('✗ Gender dropdown still not working - please check browser console for errors');
              // Show the original select as fallback
              genderElement.style.position = 'relative';
              genderElement.style.opacity = '1';
              genderElement.style.width = '100%';
              genderElement.style.height = 'auto';
              genderElement.style.visibility = 'visible';
              genderElement.style.pointerEvents = 'auto';
              genderElement.style.left = '0';
              console.log('Fallback: Showing original select element');
            }
          }, 200);
        } else {
          console.log('✓ Gender dropdown is working correctly');
        }
      }
    }
  }, 1500);
});

// Load roles from API
async function loadRoles() {
  try {
    const response = await fetch(`${API_BASE_URL}/role/`);
    
    if (!response.ok) {
      throw new Error(`Failed to load roles: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const roleSelect = document.getElementById('role_id');
    
    if (!roleSelect) {
      console.error('Role select element not found');
      return;
    }
    
    roleSelect.innerHTML = '<option value="">Select Role</option>';
    
    let roles = [];
    if (Array.isArray(data)) {
      roles = data;
    } else if (data.results && Array.isArray(data.results)) {
      // Handle paginated response
      roles = data.results;
    }
    
    if (roles.length === 0) {
      roleSelect.innerHTML = '<option value="">No roles available</option>';
      console.warn('No roles found in API response');
      return;
    }
    
    roles.forEach(role => {
      const option = document.createElement('option');
      option.value = role.role_id;  // Store role_id for submission
      // Display role_display_name from role API
      option.textContent = role.role_display_name || role.role_key || `Role ${role.role_id}`;
      roleSelect.appendChild(option);
      
      // Store role data for checking if it's donor
      rolesData[role.role_id] = role;
    });
    
    // Reinitialize nice-select for roles dropdown
    if (typeof $ !== 'undefined' && $.fn.niceSelect) {
      $('#role_id').niceSelect('update');
      
      // Add change event listener to show/hide donor fields
      $('#role_id').on('change', function() {
        handleRoleChange();
      });
    }
    
    console.log(`Loaded ${roles.length} roles successfully`);
  } catch (error) {
    console.error('Error loading roles:', error);
    const roleSelect = document.getElementById('role_id');
    if (roleSelect) {
      roleSelect.innerHTML = '<option value="">Error loading roles - Click to refresh</option>';
    }
    // Don't show error message immediately, let user try to submit
  }
}

// Store roles data for checking donor role
let rolesData = {};

// Store donation types data for checking paid type
let donationTypesData = {};

// Handle donation type change - show/hide donation fee field
function handleDonationTypeChange() {
  const donationTypeId = document.getElementById('donation_type_id').value;
  const donationFeeField = document.getElementById('donationFeeField');
  const donationFeeInput = document.getElementById('donation_fee');
  
  if (!donationTypeId) {
    donationFeeField.style.display = 'none';
    donationFeeInput.required = false;
    return;
  }
  
  // Check if selected donation type is "paid" (check by donation_type_key or donation_type_display_name)
  const selectedDonationType = donationTypesData[donationTypeId];
  if (selectedDonationType) {
    const typeKey = (selectedDonationType.donation_type_key || '').toLowerCase();
    const typeDisplayName = (selectedDonationType.donation_type_display_name || '').toLowerCase();
    
    if (typeKey === 'paid' || typeDisplayName === 'paid') {
      donationFeeField.style.display = 'block';
      donationFeeInput.required = true;
      console.log('Paid donation type selected - showing donation fee field');
    } else {
      donationFeeField.style.display = 'none';
      donationFeeInput.required = false;
      donationFeeInput.value = ''; // Clear the value when hidden
      console.log('Free donation type selected - hiding donation fee field');
    }
  }
}

// Handle role change - show/hide donor profile fields
function handleRoleChange() {
  const roleId = document.getElementById('role_id').value;
  const donorFields = document.getElementById('donorProfileFields');
  
  if (!roleId) {
    donorFields.style.display = 'none';
    return;
  }
  
  // Check if selected role is "donor" (check by role_key or role_display_name)
  const selectedRole = rolesData[roleId];
  if (selectedRole) {
    const roleKey = (selectedRole.role_key || '').toLowerCase();
    const roleDisplayName = (selectedRole.role_display_name || '').toLowerCase();
    
    if (roleKey === 'donor' || roleDisplayName === 'donor') {
      donorFields.style.display = 'block';
      console.log('Donor role selected - showing donor profile fields');
      
      // Make donor fields required
      document.getElementById('blood_group').setAttribute('data-required', 'true');
      document.getElementById('city').required = true;
      document.getElementById('donation_type_id').setAttribute('data-required', 'true');
      
      // Initialize nice-select for new dropdowns
      if (typeof $ !== 'undefined' && $.fn.niceSelect) {
        $('#blood_group').niceSelect();
        $('#donor_preferred_hospital').niceSelect('update');
        
        // Sync donor preferred hospital with user preferred hospital if already selected
        const userHospital = $('#prefered_hospital_id').val();
        if (userHospital) {
          $('#donor_preferred_hospital').val(userHospital);
          $('#donor_preferred_hospital').niceSelect('update');
          console.log('Auto-synced user preferred hospital to donor preferred hospital');
        }
        
        $('#donation_type_id').niceSelect('update');
      }
    } else {
      donorFields.style.display = 'none';
      console.log('Non-donor role selected - hiding donor profile fields');
      
      // Remove required attributes
      document.getElementById('blood_group').removeAttribute('data-required');
      document.getElementById('city').required = false;
      document.getElementById('donation_type_id').removeAttribute('data-required');
    }
  }
}

// Load donation types from API
async function loadDonationTypes() {
  try {
    console.log(`Fetching donation types from: ${API_BASE_URL}/donation-types/`);
    const response = await fetch(`${API_BASE_URL}/donation-types/`);
    
    if (!response.ok) {
      throw new Error(`Failed to load donation types: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Donation types API response:', data);
    
    const donationTypeSelect = document.getElementById('donation_type_id');
    
    if (!donationTypeSelect) {
      console.error('Donation type select element not found');
      return;
    }
    
    donationTypeSelect.innerHTML = '<option value="">Select Donation Type</option>';
    
    let donationTypes = [];
    if (Array.isArray(data)) {
      donationTypes = data;
    } else if (data.results && Array.isArray(data.results)) {
      // Handle paginated response
      donationTypes = data.results;
    } else if (data.data && Array.isArray(data.data)) {
      // Handle nested data response
      donationTypes = data.data;
    }
    
    if (donationTypes.length === 0) {
      donationTypeSelect.innerHTML = '<option value="">No donation types available</option>';
      console.warn('No donation types found in API response. Response data:', data);
      return;
    }
    
    donationTypes.forEach(donationType => {
      const option = document.createElement('option');
      option.value = donationType.donation_type_id;
      option.textContent = donationType.donation_type_display_name || donationType.donation_type_key || `Type ${donationType.donation_type_id}`;
      donationTypeSelect.appendChild(option);
      
      // Store donation type data for checking if it's "paid"
      donationTypesData[donationType.donation_type_id] = donationType;
    });
    
    // Reinitialize nice-select for donation types dropdown
    if (typeof $ !== 'undefined' && $.fn.niceSelect) {
      $('#donation_type_id').niceSelect('update');
      
      // Add change event listener to show/hide donation fee field
      $('#donation_type_id').on('change', function() {
        handleDonationTypeChange();
      });
    }
    
    console.log(`Loaded ${donationTypes.length} donation types successfully`);
    console.log('Donation types data:', donationTypesData);
    console.log('Donation types data:', donationTypesData);
  } catch (error) {
    console.error('Error loading donation types:', error);
    const donationTypeSelect = document.getElementById('donation_type_id');
    if (donationTypeSelect) {
      donationTypeSelect.innerHTML = '<option value="">Error loading donation types</option>';
    }
  }
}

// Load hospitals from API
async function loadHospitals() {
  try {
    const response = await fetch(`${API_BASE_URL}/preferred-hospitals/`);
    
    if (!response.ok) {
      throw new Error(`Failed to load hospitals: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const hospitalSelect = document.getElementById('prefered_hospital_id');
    
    if (!hospitalSelect) {
      console.error('Hospital select element not found');
      return;
    }
    
    hospitalSelect.innerHTML = '<option value="">Select Hospital (Optional)</option>';
    
    let hospitals = [];
    if (Array.isArray(data)) {
      hospitals = data;
    } else if (data.results && Array.isArray(data.results)) {
      // Handle paginated response
      hospitals = data.results;
    }
    
    if (hospitals.length === 0) {
      hospitalSelect.innerHTML = '<option value="">No hospitals available</option>';
      console.warn('No hospitals found in API response');
      return;
    }
    
    hospitals.forEach(hospital => {
      const option = document.createElement('option');
      option.value = hospital.preferred_hospital_id;
      const displayName = hospital.hospital_name 
        ? `${hospital.hospital_name}${hospital.city_name ? ' - ' + hospital.city_name : ''}`
        : `Hospital ${hospital.preferred_hospital_id}`;
      option.textContent = displayName;
      hospitalSelect.appendChild(option);
      
      // Also add to donor preferred hospital dropdown
      const donorHospitalSelect = document.getElementById('donor_preferred_hospital');
      if (donorHospitalSelect) {
        const donorOption = document.createElement('option');
        donorOption.value = hospital.preferred_hospital_id;
        donorOption.textContent = displayName;
        donorHospitalSelect.appendChild(donorOption);
      }
    });
    
    // Reinitialize nice-select for hospitals dropdowns
    if (typeof $ !== 'undefined' && $.fn.niceSelect) {
      $('#prefered_hospital_id').niceSelect('update');
      $('#donor_preferred_hospital').niceSelect('update');
      
      // Sync hospital selections - when one changes, update the other
      $('#prefered_hospital_id').on('change', function() {
        const selectedValue = $(this).val();
        $('#donor_preferred_hospital').val(selectedValue);
        $('#donor_preferred_hospital').niceSelect('update');
        console.log('Synced hospital selection to donor preferred hospital:', selectedValue);
      });
      
      $('#donor_preferred_hospital').on('change', function() {
        const selectedValue = $(this).val();
        $('#prefered_hospital_id').val(selectedValue);
        $('#prefered_hospital_id').niceSelect('update');
        console.log('Synced donor preferred hospital to user preferred hospital:', selectedValue);
      });
    }
    
    console.log(`Loaded ${hospitals.length} hospitals successfully`);
  } catch (error) {
    console.error('Error loading hospitals:', error);
    const hospitalSelect = document.getElementById('prefered_hospital_id');
    if (hospitalSelect) {
      hospitalSelect.innerHTML = '<option value="">Error loading hospitals</option>';
    }
  }
}

// Show message to user
function showMessage(message, type = 'info') {
  const messageDiv = document.getElementById('formMessage');
  messageDiv.className = `alert alert-${type}`;
  messageDiv.innerHTML = message; // Use innerHTML to support <br> tags
  messageDiv.style.display = 'block';
  
  // Scroll to message
  messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  // Auto hide after 5 seconds for success messages
  if (type === 'success') {
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 5000);
  }
}

// Initialize form
function initializeForm() {
  const form = document.getElementById('registerForm');
  
  if (!form) {
    console.error('Form element not found');
    return;
  }
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submit triggered');
    
    // Get form data
    const formData = new FormData(form);
    
    // Prepare data for API - exactly matching User model fields
    const roleId = formData.get('role_id');
    const preferedHospitalId = formData.get('prefered_hospital_id');
    const phoneNumber = formData.get('phone_number');
    const gender = formData.get('gender');
    const ageInput = formData.get('age');
    const avatarFile = document.getElementById('avatar_url').files[0];
    
    // Get required fields - matching User model exactly
    const frist_name = formData.get('frist_name')?.trim();
    const last_name = formData.get('last_name')?.trim();
    const email = formData.get('email')?.trim();
    const password = formData.get('password');
    
    // Validate required fields first
    if (!frist_name || !last_name || !email || !password || !roleId || !gender || !ageInput) {
      showMessage('Please fill in all required fields (First Name, Last Name, Email, Password, Age, Gender, and Role).', 'danger');
      return;
    }
    
    // Check if donor role is selected and validate donor fields
    const selectedRole = rolesData[roleId];
    let isDonor = false;
    if (selectedRole) {
      const roleKey = (selectedRole.role_key || '').toLowerCase();
      const roleDisplayName = (selectedRole.role_display_name || '').toLowerCase();
      isDonor = (roleKey === 'donor' || roleDisplayName === 'donor');
    }
    
    // Validate donor profile fields if donor role is selected
    if (isDonor) {
      const bloodGroup = formData.get('blood_group');
      const city = formData.get('city')?.trim();
      const donationTypeId = formData.get('donation_type_id');
      
      if (!bloodGroup || !city || !donationTypeId) {
        showMessage('Please fill in all required donor profile fields (Blood Group, City, and Donation Type).', 'danger');
        return;
      }
      
      // Validate donation fee if paid type is selected
      const selectedDonationType = donationTypesData[donationTypeId];
      if (selectedDonationType) {
        const typeKey = (selectedDonationType.donation_type_key || '').toLowerCase();
        const typeDisplayName = (selectedDonationType.donation_type_display_name || '').toLowerCase();
        
        if (typeKey === 'paid' || typeDisplayName === 'paid') {
          const donationFee = formData.get('donation_fee');
          if (!donationFee || donationFee.trim() === '' || parseFloat(donationFee) <= 0) {
            showMessage('Please enter a valid donation fee in PKR for paid donation type.', 'danger');
            return;
          }
        }
      }
    }
    
    // Validate and parse age
    const age = parseInt(ageInput);
    if (isNaN(age) || age < 1 || age > 120) {
      showMessage('Please enter a valid age (between 1 and 120).', 'danger');
      return;
    }
    
    // Validate age >= 18
    if (age < 18) {
      showMessage('You must be at least 18 years old to register. Your age is ' + age + ' years.', 'danger');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address.', 'danger');
      return;
    }
    
    // Build userData object matching User model fields exactly
    const userData = {
      frist_name: frist_name,           // CharField - required
      last_name: last_name,             // CharField - required
      email: email,                     // EmailField - required, unique
      password: password,               // CharField - required
      age: age,                         // IntegerField - required
      gender: gender.trim(),            // CharField - required
    };
    
    // Add optional fields matching User model
    // phone_number: CharField(max_length=20, null=True, blank=True)
    if (phoneNumber && phoneNumber.trim()) {
      userData.phone_number = phoneNumber.trim();
    }
    
    // role: ForeignKey(role, db_column='role_id', null=True, blank=True)
    // DRF expects the model field name 'role' with the ID value (integer)
    if (roleId && roleId.trim()) {
      const roleIdInt = parseInt(roleId);
      if (isNaN(roleIdInt)) {
        showMessage('Invalid role selected. Please select a valid role.', 'danger');
        return;
      }
      userData.role = roleIdInt;
    }
    
    // prefered_hospital_id: IntegerField(null=True, blank=True)
    if (preferedHospitalId && preferedHospitalId.trim()) {
      userData.prefered_hospital_id = parseInt(preferedHospitalId);
    }
    
    // avatar_url: ImageField(upload_to='avatars/', null=True, blank=True)
    // Will be handled separately in FormData if file is uploaded
    
    // Disable submit button
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Submitting... <span><i class="fas fa-spinner fa-spin"></i></span>';
    
    try {
      // Prepare data for API - handle file upload if avatar is selected
      let finalData;
      let headers = {};
      
      if (avatarFile) {
        // If avatar is uploaded, use FormData (multipart/form-data)
        const uploadFormData = new FormData();
        // Add all userData fields to FormData
        Object.keys(userData).forEach(key => {
          const value = userData[key];
          // Convert integers to strings for FormData (FormData only accepts strings/files)
          if (typeof value === 'number') {
            uploadFormData.append(key, value.toString());
          } else if (value !== null && value !== undefined) {
            uploadFormData.append(key, value);
          }
        });
        uploadFormData.append('avatar_url', avatarFile);
        finalData = uploadFormData;
        // Don't set Content-Type header - browser will set it with boundary for FormData
      } else {
        // Otherwise, send JSON
        headers = {
          'Content-Type': 'application/json',
        };
        finalData = JSON.stringify(userData);
      }
      
      console.log('Submitting user data:', userData);
      console.log('Final data type:', avatarFile ? 'FormData' : 'JSON');
      if (!avatarFile) {
        console.log('JSON string:', finalData);
      }
      
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'POST',
        headers: headers,
        body: finalData
      });
      
      let result;
      try {
        result = await response.json();
      } catch (e) {
        console.error('Error parsing response:', e);
        showMessage('Server response error. Please try again.', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit <span><i class="fas fa-arrow-right"></i></span>';
        return;
      }
      
      console.log('API Response:', result);
      
      if (response.ok || response.status === 201) {
        // User created successfully
        const userId = result.user_id || result.id;
        console.log('User created successfully with ID:', userId);
        
        // If donor role is selected, create donor profile
        if (isDonor && userId) {
          try {
            await createDonorProfile(userId, formData);
            showMessage('User and donor profile registered successfully! Redirecting...', 'success');
          } catch (donorError) {
            console.error('Error creating donor profile:', donorError);
            showMessage('User registered but failed to create donor profile. Please contact support.', 'warning');
          }
        } else {
          showMessage('User registered successfully! Redirecting...', 'success');
        }
        
        // Reset form
        form.reset();
        
        // Reload dropdowns to reset their state
        setTimeout(() => {
          loadRoles();
          loadHospitals();
        }, 100);
        
        // Redirect to index.html after 2 seconds
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
      } else {
        // Handle errors - show detailed validation errors
        let errorMessage = 'Registration failed. Please try again.';
        let errorDetails = '';
        
        if (result.errors) {
          // Show detailed field errors
          const errorList = Object.entries(result.errors).map(([key, value]) => {
            if (Array.isArray(value)) {
              return `${key}: ${value.join(', ')}`;
            } else if (typeof value === 'object') {
              return `${key}: ${JSON.stringify(value)}`;
            }
            return `${key}: ${value}`;
          }).join('<br>');
          errorDetails = errorList;
          console.error('Validation errors:', result.errors);
        }
        
        if (result.detail) {
          errorMessage = result.detail;
        } else if (result.message) {
          errorMessage = result.message;
        } else if (result.error) {
          errorMessage = result.error;
        }
        
        // Show combined error message
        if (errorDetails) {
          showMessage(errorMessage + '<br><br>Details:<br>' + errorDetails, 'danger');
        } else {
          showMessage(errorMessage, 'danger');
        }
        
        // Re-enable submit button on error
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit <span><i class="fas fa-arrow-right"></i></span>';
      }
    } catch (error) {
      console.error('Registration error:', error);
      showMessage('An error occurred. Please check your connection and try again. Error: ' + error.message, 'danger');
      // Re-enable submit button on error
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Submit <span><i class="fas fa-arrow-right"></i></span>';
    }
  });
}

// Create donor profile after user is created
async function createDonorProfile(userId, formData) {
  const bloodGroup = formData.get('blood_group');
  const city = formData.get('city')?.trim();
  // Use donor preferred hospital, or fallback to user preferred hospital if not set (they should be synced)
  let donorPreferredHospitalId = formData.get('donor_preferred_hospital');
  if (!donorPreferredHospitalId || donorPreferredHospitalId === '') {
    donorPreferredHospitalId = formData.get('prefered_hospital_id');
  }
  const donationTypeId = formData.get('donation_type_id');
  const availability = document.getElementById('availability').checked;
  const donationFee = formData.get('donation_fee');
  
  const donorProfileData = {
    user: userId,  // Foreign key to User
    blood_group: bloodGroup,
    city: city,
    availability: availability,
    donation_type: parseInt(donationTypeId)
  };
  
  // Add optional fields
  if (donorPreferredHospitalId && donorPreferredHospitalId.trim()) {
    donorProfileData.preferred_hospital = parseInt(donorPreferredHospitalId);
  }
  
  if (donationFee && donationFee.trim()) {
    donorProfileData.donation_fee = parseFloat(donationFee);
  }
  
  console.log('Creating donor profile with data:', donorProfileData);
  
  const response = await fetch(`${API_BASE_URL}/donor-profiles/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(donorProfileData)
  });
  
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
    }
    throw new Error(`Failed to create donor profile: ${JSON.stringify(errorData)}`);
  }
  
  const result = await response.json();
  console.log('Donor profile created successfully:', result);
  return result;
}

