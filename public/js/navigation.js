// View switching and sidebar control logic
function switchView(viewId) {
  // Hide all views
  document.querySelectorAll('.view-section').forEach(view => {
    view.classList.remove('active');
  });

  // Show selected view
  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Update sidebar active link state
  document.querySelectorAll('.sidebar-link').forEach(link => {
    if (link.dataset.target === viewId) {
      link.classList.add('active');
      // Update breadcrumb
      const viewName = link.textContent.trim();
      const breadcrumb = document.getElementById('breadcrumbActive');
      if (breadcrumb) {
        breadcrumb.textContent = viewName;
      }
    } else {
      link.classList.remove('active');
    }
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close mobile sidebar if open
  const sidebar = document.getElementById('sidebar');
  if (sidebar && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Sidebar links click handler
  document.querySelectorAll('.sidebar-link').forEach(link => {
    if (link.dataset.target) {
      link.addEventListener('click', () => {
        switchView(link.dataset.target);
      });
    }
  });

  // Mobile drawer toggle
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sidebar = document.getElementById('sidebar');

  if (hamburgerBtn && sidebar) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });

    // Close sidebar on click outside
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== hamburgerBtn) {
        sidebar.classList.remove('open');
      }
    });
  }

  // --- INTERACTIVE SELF-ASSESSMENT LOGIC ---
  const subjectCards = document.querySelectorAll('.subject-card');
  const assessmentResult = document.getElementById('assessmentResult');
  const assessmentResultTitle = document.getElementById('assessmentResultTitle');
  const assessmentResultText = document.getElementById('assessmentResultText');
  const assessmentResultList = document.getElementById('assessmentResultList');

  const subjectData = {
    math: {
      title: "📐 Math & Finance Careers",
      desc: "Based on your interest in mathematics and analytics, these high-demand tracks focus on logic, data structures, and financial engineering.",
      careers: ["Engineering (Software, Civil, Electrical)", "Actuarial Science & Finance", "Data Science & AI Engineering", "Quantitative Analysis", "Architecture & Structural Design"]
    },
    science: {
      title: "🧪 Health & Life Sciences Careers",
      desc: "Your affinity for sciences maps to biological research, medicine, healthcare operations, and organic engineering fields.",
      careers: ["Medicine & Surgery", "Nursing & Public Health", "Pharmacy & Pharmacology", "Biotechnology & Lab Research", "Environmental Science & Agro-innovation"]
    },
    arts: {
      title: "🎨 Humanities & Creative Arts Careers",
      desc: "For strong linguistic, historical and artistic interests, these tracks focus on social structures, communication, and legal design.",
      careers: ["Law & Legal Advocacy", "Journalism & Mass Communication", "Public Relations & Marketing", "Teaching & Academic Leadership", "Content Creation & Digital Styling"]
    }
  };

  subjectCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove selection from all cards
      subjectCards.forEach(c => c.classList.remove('selected'));
      // Select clicked card
      card.classList.add('selected');

      const subject = card.dataset.subject;
      const data = subjectData[subject];

      if (data) {
        // Build list
        assessmentResultList.innerHTML = data.careers.map(career => `
          <div class="career-item">${career}</div>
        `).join('');

        // Update header and description
        assessmentResultTitle.textContent = data.title;
        assessmentResultText.textContent = data.desc;

        // Show result box with animation
        assessmentResult.style.display = 'block';
        assessmentResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
});
