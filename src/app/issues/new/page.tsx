"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';

// Dynamically import SimpleMDE without SSR
import dynamic from 'next/dynamic';
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });
import "easymde/dist/easymde.min.css";

interface IssueForm {
    title: string;
    description: string;
    userId: string;
}

const NewIssue = ({ userId }: { userId: string }) => {
    const { register, control, handleSubmit, reset } = useForm<IssueForm>();
    const [isSubmitting, setIssubmitting] = useState(false);
    const router = useRouter();

    return (
        <div className='container p-10 flex flex-col gap-6'>
            <form onSubmit={handleSubmit(async (data) => {
                try {
                    setIssubmitting(true);
                    const response = await axios.post("/api/issues", {
                        title: data.title,
                        description: data.description,
                        userId: userId
                    });
                    if (response.status !== 201) {
                        toast.error("Issue submission failed");
                        reset();
                        throw new Error('Failed to submit the issue.');
                    }
                    router.push('/issues');
                    toast.success("Issue submitted successfully");
                } catch (error) {
                    console.error(error);
                }
            })}>
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
