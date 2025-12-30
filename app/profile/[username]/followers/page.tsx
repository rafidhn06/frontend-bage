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

export default function FollowersPage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const resolvedParams = use(params);
    const router = useRouter();
    const username = decodeURIComponent(resolvedParams.username);
    const cleanUsername = username.startsWith('%40') ? username.slice(3) : username.replace('@', '');

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await api.get(`/users/${cleanUsername}`);
                const followersRes = await api.get(
                    `/users/${userRes.data.data.id}/followers`
                );
                setUsers(followersRes.data.data);
            } catch (error) {
                toast.error('Gagal memuat daftar pengikut.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [cleanUsername]);

    return (
        <>
            <TopBar className="flex w-full items-center gap-3 p-4 text-xl font-semibold">
                <Button variant="ghost" size="icon" aria-label="Kembali" onClick={() => router.back()}>
                    <ArrowLeft size={20} />
                </Button>
                Pengikut
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
