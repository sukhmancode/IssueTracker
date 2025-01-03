"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';

import dynamic from 'next/dynamic';
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });
import "easymde/dist/easymde.min.css";

interface IssueForm {
    title: string;
    description: string;
}

const NewIssue = () => {
    const { register, control, handleSubmit, reset } = useForm<IssueForm>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userId, setUserId] = useState<string | null>(null); // Store userId here
    const router = useRouter();

 
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const sessionResponse = await axios.get("/api/auth/session"); // Replace with your session endpoint
                setUserId(sessionResponse.data?.userId || null); // Adjust based on your response
            } catch (error) {
                console.error("Failed to fetch userId:", error);
            }
        };

        fetchUserId();
    }, []);

    // Form submission handler
    const onSubmit = async (data: IssueForm) => {
        if (!userId) {
            toast.error("User is not logged in");
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await axios.post("/api/issues", {
                title: data.title,
                description: data.description,
                userId: userId,
            });

            if (response.status !== 201) {
                toast.error("Issue submission failed");
                reset();
                throw new Error('Failed to submit the issue.');
            }

            router.push('/issues');
            toast.success("Issue submitted successfully");
        } catch (error) {
            console.error("Error submitting issue:", error);
            toast.error("Failed to submit issue");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='container p-10 flex flex-col gap-6'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input placeholder='Enter issue title' className='border border-black' {...register("title")} />
                <Controller
                    name='description'
                    control={control}
                    render={({ field }) => (
                        <SimpleMDE placeholder='Enter issue description' {...field} />
                    )}
                />
                <Button variant={"default"} className='w-fit' disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Issue'}
                </Button>
            </form>
        </div>
    );
};

export default NewIssue;
