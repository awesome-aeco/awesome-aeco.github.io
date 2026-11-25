// Shared copy-button handler following modern-web-guidance (copy-button)
const timers = new WeakMap<HTMLElement, number>();
let lastMessage = '';

function report(button: HTMLElement, ok: boolean): void {
  const tip = button.nextElementSibling as HTMLElement | null;
  const existing = timers.get(button);
  if (existing !== undefined) window.clearTimeout(existing);

  button.removeAttribute('data-copied');
  button.removeAttribute('data-failed');

  let message = ok ? 'Copied' : 'Copy failed';
  if (message === lastMessage) message += '\u00A0';
  lastMessage = message;

  if (tip) tip.textContent = '';
  void button.offsetWidth;
  button.setAttribute(ok ? 'data-copied' : 'data-failed', '');
  if (tip) {
    requestAnimationFrame(() => {
      tip.textContent = message;
    });
  }

  timers.set(
    button,
    window.setTimeout(() => {
      button.removeAttribute('data-copied');
      button.removeAttribute('data-failed');
      if (tip) tip.textContent = '';
    }, 2000)
  );
}

async function copy(button: HTMLElement, target: HTMLElement): Promise<void> {
  const text =
    target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
      ? target.value
      : target.innerText.trim();
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    report(button, true);
  } catch {
    report(button, false);
  }
}

export function initCopyButtons(): void {
  if ('CommandEvent' in window) {
    document.addEventListener(
      'command',
      (event: Event) => {
        const cmdEvent = event as Event & {
          command?: string;
          source?: HTMLElement | null;
        };
        if (
          cmdEvent.command?.startsWith('--copy') &&
          cmdEvent.source &&
          event.target instanceof HTMLElement
        ) {
          copy(cmdEvent.source, event.target);
        }
      },
      true
    );
  } else {
    document.addEventListener('click', (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      const targetEl = event.target as HTMLElement | null;
      const button = targetEl?.closest<HTMLElement>('button[command^="--copy"]');
      if (!button) return;
      const targetId = button.getAttribute('commandfor');
      const target = targetId ? document.getElementById(targetId) : null;
      if (target) copy(button, target);
    });
  }
}
