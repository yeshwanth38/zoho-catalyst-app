/**
 * Zoho Catalyst Web Application JavaScript Controller
 * Handles Catalyst SDK Auth, Session State, View Switching, and User Details
 */

(function () {
  'use strict';

  // State
  let currentUser = null;

  // DOM Elements
  const loginView = document.getElementById('loginView');
  const homeView = document.getElementById('homeView');
  const navUser = document.getElementById('navUser');
  const userNavName = document.getElementById('userNavName');
  const userNavAvatar = document.getElementById('userNavAvatar');
  const logoutBtn = document.getElementById('logoutBtn');
  
  // Dashboard Elements
  const welcomeName = document.getElementById('welcomeName');
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const profileUserId = document.getElementById('profileUserId');
  const profileRole = document.getElementById('profileRole');
  const metricRole = document.getElementById('metricRole');
  const metricUserId = document.getElementById('metricUserId');
  const metricAuthMode = document.getElementById('metricAuthMode');

  // Form & Buttons
  const loginForm = document.getElementById('loginForm');
  const demoLoginBtn = document.getElementById('demoLoginBtn');

  /**
   * Initialize Application
   */
  function initApp() {
    setupEventListeners();
    checkAuthentication();
  }

  /**
   * Check if User is Authenticated via Catalyst Web SDK or Local Session
   */
  function checkAuthentication() {
    // 1. Check Zoho Catalyst Web SDK Auth if available
    if (typeof catalyst !== 'undefined' && catalyst.auth && typeof catalyst.auth.isUserAuthenticated === 'function') {
      catalyst.auth.isUserAuthenticated()
        .then(function (response) {
          if (response && response.content) {
            console.log('Catalyst Auth Success:', response.content);
            const userContent = response.content;
            currentUser = {
              firstName: userContent.first_name || 'Catalyst',
              lastName: userContent.last_name || 'User',
              email: userContent.email_id || userContent.email || 'user@catalyst.zoho.com',
              userId: userContent.user_id || 'CAT-' + Math.floor(100000 + Math.random() * 900000),
              role: (userContent.role_details && userContent.role_details.role_name) ? userContent.role_details.role_name : 'App User',
              authMode: 'Zoho Catalyst SDK'
            };
            showHomeView();
            return;
          }
          showLoginView();
        })
        .catch(function (err) {
          console.log('Catalyst SDK auth check:', err.message || 'Not authenticated');
          checkLocalSession();
        });
    } else {
      // 2. Local Fallback Session Check
      checkLocalSession();
    }
  }

  /**
   * Check Local Storage / Session Storage for Preview Mode
   */
  function checkLocalSession() {
    const savedUser = sessionStorage.getItem('catalyst_user');
    if (savedUser) {
      try {
        currentUser = JSON.parse(savedUser);
        showHomeView();
        return;
      } catch (e) {
        sessionStorage.removeItem('catalyst_user');
      }
    }
    showLoginView();
  }

  /**
   * Attach Event Listeners
   */
  function setupEventListeners() {
    // Standard Login Form
    if (loginForm) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const emailInput = document.getElementById('emailInput').value.trim();
        const passwordInput = document.getElementById('passwordInput').value.trim();

        if (!emailInput || !passwordInput) {
          alert('Please enter both email and password.');
          return;
        }

        const nameFromEmail = emailInput.split('@')[0];
        const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

        currentUser = {
          firstName: formattedName,
          lastName: 'User',
          email: emailInput,
          userId: 'USR-' + Math.floor(100000 + Math.random() * 900000),
          role: 'Application User',
          authMode: 'Embedded Auth'
        };

        sessionStorage.setItem('catalyst_user', JSON.stringify(currentUser));
        showHomeView();
      });
    }

    // Quick Demo Login Button
    if (demoLoginBtn) {
      demoLoginBtn.addEventListener('click', function () {
        currentUser = {
          firstName: 'Alex',
          lastName: 'Morgan',
          email: 'alex.morgan@zohocatalyst.com',
          userId: 'CAT-894201',
          role: 'System Administrator',
          authMode: 'Demo Preview'
        };

        sessionStorage.setItem('catalyst_user', JSON.stringify(currentUser));
        showHomeView();
      });
    }

    // Logout Button
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
  }

  /**
   * Handle User Logout
   */
  function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
      sessionStorage.removeItem('catalyst_user');
      currentUser = null;

      if (typeof catalyst !== 'undefined' && catalyst.auth && typeof catalyst.auth.signOut === 'function') {
        catalyst.auth.signOut(window.location.origin)
          .then(function () {
            showLoginView();
          })
          .catch(function () {
            showLoginView();
          });
      } else {
        showLoginView();
      }
    }
  }

  /**
   * Render Login View
   */
  function showLoginView() {
    homeView.classList.remove('active');
    loginView.classList.add('active');
    navUser.style.display = 'none';

    // Embed Catalyst Auth Widget if available
    if (typeof catalyst !== 'undefined' && catalyst.auth && typeof catalyst.auth.signIn === 'function') {
      try {
        const container = document.getElementById('catalyst-auth-container');
        if (container) {
          catalyst.auth.signIn('catalyst-auth-container', {
            service_url: window.location.href
          });
        }
      } catch (err) {
        console.log('Catalyst SDK embed fallback');
      }
    }
  }

  /**
   * Render Home Dashboard View
   */
  function showHomeView() {
    if (!currentUser) return;

    loginView.classList.remove('active');
    homeView.classList.add('active');

    // Update Navigation User Bar
    const fullName = `${currentUser.firstName} ${currentUser.lastName}`.trim();
    userNavName.textContent = fullName;
    userNavAvatar.textContent = currentUser.firstName.charAt(0).toUpperCase();
    navUser.style.display = 'flex';

    // Update Dashboard Welcome & Profile
    if (welcomeName) welcomeName.textContent = currentUser.firstName;
    if (profileName) profileName.textContent = fullName;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (profileUserId) profileUserId.textContent = currentUser.userId;
    if (profileRole) profileRole.textContent = currentUser.role;

    // Metrics
    if (metricRole) metricRole.textContent = currentUser.role;
    if (metricUserId) metricUserId.textContent = currentUser.userId;
    if (metricAuthMode) metricAuthMode.textContent = currentUser.authMode || 'Active';
  }

  // Start app on DOM loaded
  document.addEventListener('DOMContentLoaded', initApp);
})();
