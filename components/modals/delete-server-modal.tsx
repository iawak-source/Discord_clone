"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";





export const DeleteServerModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "deleteServer";
    const { server } = data;


    const [isLoading, setIsloading] = useState(false);

    const onClick = async () => {
        try {
            setIsloading(true);
            await axios.delete(`/api/servers/${server?.id}`);
            onClose();

            router.push("/");
            router.refresh();
        } catch (error) {
            console.log(error);
        } finally {
            setIsloading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-12 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to delete the server ? <br />
                        <span className="text-indigo-500 font-semibold">{server?.name}</span> will be permanently deleted and you will lose all data associated with it.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            variant="primary"
                            onClick={onClick}
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

}