import React, { useEffect, useState } from "react";
import UserCard from "./UserCard";

const UserCardList = ({ users = [] }) => {
    const ITEMS_PER_PAGE = 5;
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    const currentUsers = users.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handlePrev = () => setPage((p) => Math.max(1, p - 1));
    const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

    useEffect(() => {
        setPage(1); // 當 users 陣列變動時，重設為第 1 頁
    }, [users]);
    return (
        <div className="space-y-4">
            {currentUsers
                .filter(user => user && user.id !== undefined) // 🔐 避免空值或無效資料
                .map((user) => (
                    <UserCard key={user.id} user={user} />
                ))}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                        onClick={handlePrev}
                        disabled={page === 1}
                        className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        上一頁
                    </button>
                    <span>
                        第 {page} / {totalPages} 頁
                    </span>
                    <button
                        onClick={handleNext}
                        disabled={page === totalPages}
                        className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        下一頁
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserCardList;
