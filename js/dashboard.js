document.addEventListener("DOMContentLoaded", function () {
    // Session Check
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userRole = localStorage.getItem("userRole");

    const path = window.location.pathname;
    if (path.includes("admin-dashboard.html")) {
        if (isLoggedIn !== "true" || userRole !== "admin") {
            window.location.href = "login.html";
            return;
        }
    } else if (path.includes("client-dashboard.html")) {
        if (isLoggedIn !== "true" || userRole !== "client") {
            window.location.href = "login.html";
            return;
        }
    }

    // Sidebar Toggle Logic for Dashboard (Independent from main navbar)
    const toggleBtn = document.querySelector(".dashboard-mobile-toggle");
    const sidebar = document.querySelector(".sidebar");
    
    if (toggleBtn && sidebar) {
        // Create overlay
        const overlay = document.createElement("div");
        overlay.className = "dashboard-sidebar-overlay";
        document.body.appendChild(overlay);

        function openSidebar() {
            sidebar.classList.add("active");
            overlay.classList.add("active");
            document.body.style.overflow = "hidden"; // Lock scroll
        }

        function closeSidebar() {
            sidebar.classList.remove("active");
            overlay.classList.remove("active");
            document.body.style.overflow = ""; // Restore scroll
        }

        toggleBtn.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            if(sidebar.classList.contains("active")) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });

        overlay.addEventListener("click", closeSidebar);
        
        // Close on escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                closeSidebar();
            }
        });
        
        // Close on sidebar link click (mobile)
        const sidebarLinks = sidebar.querySelectorAll("a");
        sidebarLinks.forEach(link => {
            link.addEventListener("click", () => {
                if(window.innerWidth <= 768) {
                    closeSidebar();
                }
            });
        });
    }

    // Logout Functionality
    const logoutLinks = document.querySelectorAll('.logout-link');
    logoutLinks.forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.preventDefault();
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userRole");
            localStorage.removeItem("stacklyUserName");
            window.location.href = "login.html";
        });
    });
});
