// Toast notifications component
export const Toast = {
    show(message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let borderAccent = 'var(--color-primary)';
        if (type === 'error') borderAccent = 'var(--color-danger)';
        if (type === 'success') borderAccent = 'var(--color-success)';
        if (type === 'warning') borderAccent = 'var(--color-warning)';
        
        toast.style.borderLeftColor = borderAccent;

        toast.innerHTML = `
            <div style="flex: 1; padding-right: 1rem;">${message}</div>
            <span style="cursor: pointer; opacity: 0.7; font-weight: bold;" onclick="this.parentElement.remove()">&times;</span>
        `;

        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'slideIn 0.3s reverse forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }
};
