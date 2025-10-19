import * as RadixDialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { CiWarning } from "react-icons/ci";
import styled from "styled-components";

// ===== Styled Components =====
const DialogOverlay = styled(RadixDialog.Overlay)`
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    inset: 0;
`;

const DialogContent = styled(RadixDialog.Content)`
    background: #fff;
    border-radius: 1rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90vw;
    max-width: 420px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    h2 {
        font-size: 1.6rem;
        font-weight: 600;
        color: #1f2937;
    }
`;

const IconButton = styled.button`
    all: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    padding: 0.3rem;
    border: none;
    outline: none;
    &:focus {
        outline: none;
        box-shadow: none;
    }

    &:hover {
        background-color: #f3f4f6;
    }
`;

const Message = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 0.8rem;
    color: #4b5563;
    font-size: 1.4rem;

    svg {
        color: #dc2626;
        font-size: 2rem;
        flex-shrink: 0;
    }
`;

const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;

    button {
        border: none;
        border-radius: 0.5rem;
        padding: 0.8rem 1.5rem;
        font-size: 1.4rem;
        cursor: pointer;
        font-weight: 500;
    }

    .cancel {
        background-color: #e5e7eb;
        color: #374151;

        &:hover {
            background-color: #d1d5db;
        }
    }

    .delete {
        background-color: #dc2626;
        color: #fff;

        &:hover {
            background-color: #b91c1c;
        }
    }
`;

// ===== Component =====
export default function DeleteConfirmModal({ open, onOpenChange, onConfirm }) {
    return (
        <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
            <RadixDialog.Portal>
                <DialogOverlay />
                <DialogContent>
                    <Header>
                        <h2>Confirm Deletion</h2>
                        <RadixDialog.Close asChild>
                            <IconButton aria-label="Close">
                                <Cross2Icon />
                            </IconButton>
                        </RadixDialog.Close>
                    </Header>

                    <Message>
                        <CiWarning />
                        <p>
                            Are you sure you want to delete this job? This
                            action cannot be undone.
                        </p>
                    </Message>

                    <Footer>
                        <button
                            className="cancel"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="delete"
                            onClick={() => {
                                onConfirm();
                                onOpenChange(false);
                            }}
                        >
                            Delete
                        </button>
                    </Footer>
                </DialogContent>
            </RadixDialog.Portal>
        </RadixDialog.Root>
    );
}
