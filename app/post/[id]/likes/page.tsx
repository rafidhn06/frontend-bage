'use client';

import { use, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import NavigationBar from '@/components/NavigationBar';
import TopBar from '@/components/TopBar';
import UserList from '@/components/AccountList';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import api from '@/lib/axios';
import { User } from '@/types';

export default function PostLikesPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const router = useRouter();
    const id = resolvedParams.id;

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/posts/${id}/likes`);
                setUsers(response.data.data);
            } catch (error) {
                toast.error('Gagal memuat daftar like.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return (
        <>
            <TopBar className="flex w-full items-center gap-3 p-4 text-xl font-semibold">
                <Button variant="ghost" size="icon" aria-label="Kembali" onClick={() => router.back()}>
                    <ArrowLeft size={20} />
                </Button>
                Suka
            </TopBar>

            <main className="xs:pb-[78px] flex items-center justify-center pb-[81px]">
                <div className="flex w-full max-w-xl flex-col">
                    {loading ? (
                        <div className="flex h-[calc(100dvh-150px)] w-full items-center justify-center">
                            <Spinner className="size-8" />
                        </div>
                    ) : (
                        <UserList users={users} />
                    )}
                </div>
            </main>
            <NavigationBar />
        </>
    );
}
