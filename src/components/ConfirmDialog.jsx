const ConfirmDialog = ({ open, title, content, onConfirm, onCancel }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm">
            <div className="bg-background w-full max-w-sm mx-4 p-6 shadow-2xl">
                <h2 className="text-lg font-bold mb-2">{title}</h2>
                <p className="text-sm text-muted-foreground mb-6">{content}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2 text-sm font-medium border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;