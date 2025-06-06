"use client";
import { useUser } from "@clerk/nextjs";
import *as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { use, useEffect, useState } from "react";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";


const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required",
    }),
    imageUrl: z.string().min(1, {
        message: "Image URL is required",
    })
});


export const InitialModal = () => {
    const [isMounted, setIsMounted] = useState(false);

    const router = useRouter();
    

    useEffect(() => {
        setIsMounted(true);
    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.post("/api/servers", values);

            form.reset();
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.error("Error creating server:", error);
        }
    }
    if (!isMounted) {
        return null;
    }
    return (
        <Dialog open >
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-12 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your server a personality with a name and an image.
                        You can change it later
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({field}) =>(
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="serverImage"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}/>
                            </div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Server name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field} //  cần để binding input
                                                disabled={isLoading}
                                                className="bg-zinc-100 border border-zinc-300 rounded-md px-3 py-2
                                                             text-black focus-visible:ring-2 focus-visible:ring-offset-2
                                                             focus-visible:ring-gray-500"
                                                placeholder="Server name"
                                                {...field} //  cần để binding input
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant={"primary"} disabled={isLoading} >
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );

}