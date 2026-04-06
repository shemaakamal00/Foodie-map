const tipsForm = document.getElementById('tips-form') as HTMLFormElement;
const formBlock = document.getElementById('form-block') as HTMLDivElement;

tipsForm.addEventListener('submit', (event: SubmitEvent) => {
  event.preventDefault();

  // Replace form content with success message
  formBlock.innerHTML = `<div class="form-response">
  <svg width="100" height="100" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill="green" />
    <path d="M30 50 L45 65 L70 35" stroke="white" stroke-width="10" fill="none" />
  </svg>
  <p>Tack för ditt tips! Vi har mottagit din inlämning.</p>
</div>`;
});

