
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const tabButtons = document.querySelectorAll('.sidebar-menu-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Toggle sidebar
  sidebarToggle.addEventListener('click', function() {
    if (window.innerWidth <= 1024) {
      sidebar.classList.toggle('open');
    } else {
      sidebar.classList.toggle('collapsed');
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 1024) {
      sidebar.classList.remove('collapsed');
      if (sidebar.classList.contains('open')) return;
      sidebar.classList.remove('open');
    }
  });
  
  // Set active tab
  window.setActiveTab = function(tabId) {
    // Update tab buttons
    tabButtons.forEach(button => {
      if (button.getAttribute('onclick') === `setActiveTab('${tabId}')`) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    // Update tab contents
    tabContents.forEach(content => {
      if (content.id === tabId) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
    
    // Close sidebar on mobile when tab is selected
    if (window.innerWidth <= 1024) {
      sidebar.classList.remove('open');
    }
  };
  
  // Initial setup - ensure first tab is active
  if (tabButtons.length > 0 && tabContents.length > 0) {
    const firstTabId = 'overview';
    setActiveTab(firstTabId);
  }
  
  // Close sidebar when clicking outside of it on mobile
  document.addEventListener('click', function(event) {
    if (window.innerWidth <= 1024 && sidebar.classList.contains('open')) {
      if (!sidebar.contains(event.target) && event.target !== sidebarToggle) {
        sidebar.classList.remove('open');
      }
    }
  });
});
