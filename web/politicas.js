// Políticas Page - Accordion Functionality

function toggleAccordion(button) {
  const content = button.nextElementSibling;
  const isActive = button.classList.contains('active');
  
  // Close all accordions
  const allTriggers = document.querySelectorAll('.accordion-trigger');
  const allContents = document.querySelectorAll('.accordion-content');
  
  allTriggers.forEach(trigger => trigger.classList.remove('active'));
  allContents.forEach(content => content.classList.remove('active'));
  
  // Open clicked accordion if it was closed
  if (!isActive) {
    button.classList.add('active');
    content.classList.add('active');
  }
}
