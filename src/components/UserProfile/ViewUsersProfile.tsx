import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { useEffect, useState } from "react";
import api from "../../common/axiosConfig.tsx";
import { useModal } from "../../hooks/useModal.ts";
import { Modal } from "../ui/modal";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import Button from "../ui/button/Button.tsx";
import Badge from "../ui/badge/Badge.tsx";
import { SHOP_NAME } from "../../common/constants.tsx";

export default function ViewUsersProfile() {
    const emptyUser = {
        id: "",
        username: "",
        password: "",
        fullname: "",
        address: "",
        phonenumber: "",
        emailid: "",
        role: "",
        status: "",
        startdate: "",
        enddate: "",
        referredby: "",
    };

    const roles = ["ADMIN", "STAFF", "AGENT"];
    const status = ["Active", "Inactive"];

    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(emptyUser);

    const { isOpen, openModal, closeModal } = useModal();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get("/api/users");
            console.log(response);
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (isEditMode) {
                await api.put(
                    `/api/users/${selectedUser.id}`,
                    selectedUser
                );
            } else {
                await api.post(
                    "/api/users",
                    selectedUser
                );
            }

            fetchUsers();
            closeModal();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                        <span className="text-sm text-slate-500">
                            Loading users...
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-slate-50">

                {/* =====================================================
                    PAGE HEADER
                ====================================================== */}
                <div className="mb-6 rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">

                    <div className="flex items-center justify-between gap-4">

                        <div>
                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 20h5v-2a4 4 0 00-4-4h-1m-4 6H3v-2a4 4 0 014-4h6a4 4 0 014 4v2zm-3-10a4 4 0 11-8 0 4 4 0 018 0zm6 1a3 3 0 10-3-3"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <h1 className="text-2xl font-semibold text-slate-800">
                                        User Management
                                    </h1>

                                    <p className="mt-0.5 text-sm text-slate-500">
                                        Manage staff, administrators and agents
                                    </p>
                                </div>

                            </div>
                        </div>

                        <Button
                            onClick={() => {
                                setSelectedUser({ ...emptyUser });
                                setIsEditMode(false);
                                openModal();
                            }}
                            className="rounded-lg bg-blue-600 px-5 text-white shadow-sm transition-colors hover:bg-blue-700"
                        >
                            + Add User
                        </Button>

                    </div>

                </div>


                {/* =====================================================
                    USER TABLE
                ====================================================== */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

                    <div className="p-5">

                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-slate-800">
                                Users
                            </h2>

                            <p className="mt-0.5 text-sm text-slate-500">
                                View and manage registered users
                            </p>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-slate-200">

                            <Table>

                                {/* TABLE HEADER */}
                                <TableHeader className="bg-slate-100">

                                    <TableRow>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            ID
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            Username
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            Name
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            Address
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            Phone Number
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            Email
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            Role
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            Status
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            Service Start
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            Service End
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            Referred By
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            Action
                                        </TableCell>

                                    </TableRow>

                                </TableHeader>


                                {/* TABLE BODY */}
                                <TableBody className="divide-y divide-slate-100 bg-white">

                                    {users.length === 0 ? (

                                        <TableRow>

                                            <TableCell
                                                className="px-4 py-10 text-center text-sm text-slate-500"
                                            >
                                                No users found
                                            </TableCell>

                                        </TableRow>

                                    ) : (

                                        users.map((user) => (

                                            <TableRow
                                                key={user.id}
                                                className="transition-colors hover:bg-slate-50"
                                            >

                                                <TableCell className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-700">
                                                    {user.id}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-800">
                                                    {user.username}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                                                    {user.fullname}
                                                </TableCell>

                                                <TableCell className="px-4 py-3 text-sm text-slate-600">
                                                    {user.address}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                                                    {user.phonenumber}
                                                </TableCell>

                                                <TableCell className="px-4 py-3 text-sm text-slate-600">
                                                    {user.emailid}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                                                    {user.role}
                                                </TableCell>

                                                <TableCell className="px-4 py-3">

                                                    <Badge
                                                        size="sm"
                                                        color={
                                                            user.status?.toLowerCase() === "active"
                                                                ? "success"
                                                                : user.status?.toLowerCase() === "inactive"
                                                                    ? "error"
                                                                    : "warning"
                                                        }
                                                    >
                                                        {user.status}
                                                    </Badge>

                                                </TableCell>

                                                <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">
                                                    {user.startdate}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">
                                                    {user.enddate}
                                                </TableCell>

                                                <TableCell className="px-4 py-3 text-sm text-slate-500">
                                                    {user.referredby}
                                                </TableCell>

                                                <TableCell className="px-4 py-3">

                                                    <div className="flex justify-center">

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setIsEditMode(true);
                                                                openModal();
                                                            }}
                                                            className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
                                                        >
                                                            <span className="flex items-center gap-1.5">

                                                                <svg
                                                                    className="h-3.5 w-3.5"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.5-9.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 8.5-8.5z"
                                                                    />
                                                                </svg>

                                                                Edit

                                                            </span>
                                                        </button>

                                                    </div>

                                                </TableCell>

                                            </TableRow>

                                        ))

                                    )}

                                </TableBody>

                            </Table>

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================================
                USER MODAL
            ====================================================== */}
            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                className="max-w-[700px] m-4"
            >

                <div className="rounded-xl border border-slate-200 bg-white shadow-xl">

                    {/* MODAL HEADER */}
                    <div className="border-b border-slate-200 px-6 py-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m8-8a4 4 0 100-8 4 4 0 000 8zm6-3a3 3 0 100-6 3 3 0 000 6zm0 0v1m0 4v1m-2-3h4"
                                    />
                                </svg>

                            </div>

                            <div>

                                <h2 className="text-xl font-semibold text-slate-800">
                                    {isEditMode ? "Update User" : "Create User"}
                                </h2>

                                <p className="mt-0.5 text-sm text-slate-500">
                                    {SHOP_NAME} User Management
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* FORM */}
                    <form className="flex flex-col">

                        <div className="max-h-[65vh] overflow-y-auto px-6 py-5 custom-scrollbar">

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                {/* FULL NAME */}
                                <div>
                                    <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Full Name
                                    </Label>

                                    <Input
                                        type="text"
                                        value={selectedUser.fullname || ""}
                                        onChange={(e) =>
                                            setSelectedUser({
                                                ...selectedUser,
                                                fullname: e.target.value,
                                            })
                                        }
                                        className="rounded-lg border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter full name"
                                    />
                                </div>


                                {/* USERNAME */}
                                <div>
                                    <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Username
                                    </Label>

                                    <Input
                                        type="text"
                                        value={selectedUser.username || ""}
                                        onChange={(e) =>
                                            setSelectedUser({
                                                ...selectedUser,
                                                username: e.target.value,
                                            })
                                        }
                                        className="rounded-lg border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter username"
                                    />
                                </div>


                                {/* PASSWORD */}
                                <div>
                                    <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Password
                                    </Label>

                                    <Input
                                        type="password"
                                        value={selectedUser.password || ""}
                                        onChange={(e) =>
                                            setSelectedUser({
                                                ...selectedUser,
                                                password: e.target.value,
                                            })
                                        }
                                        className="rounded-lg border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter password"
                                    />
                                </div>


                                {/* ADDRESS */}
                                <div>
                                    <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Address
                                    </Label>

                                    <Input
                                        type="text"
                                        value={selectedUser.address || ""}
                                        onChange={(e) =>
                                            setSelectedUser({
                                                ...selectedUser,
                                                address: e.target.value,
                                            })
                                        }
                                        className="rounded-lg border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter address"
                                    />
                                </div>


                                {/* PHONE */}
                                <div>
                                    <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Phone Number
                                    </Label>

                                    <Input
                                        type="text"
                                        value={selectedUser.phonenumber || ""}
                                        onChange={(e) =>
                                            setSelectedUser({
                                                ...selectedUser,
                                                phonenumber: e.target.value,
                                            })
                                        }
                                        className="rounded-lg border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter phone number"
                                    />
                                </div>


                                {/* EMAIL */}
                                <div>
                                    <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Email
                                    </Label>

                                    <Input
                                        type="email"
                                        value={selectedUser.emailid || ""}
                                        onChange={(e) =>
                                            setSelectedUser({
                                                ...selectedUser,
                                                emailid: e.target.value,
                                            })
                                        }
                                        className="rounded-lg border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter email address"
                                    />
                                </div>


                                {/* ROLE */}
                                <div>
                                    <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Role
                                    </Label>

                                    <select
                                        value={selectedUser.role || ""}
                                        onChange={(e) =>
                                            setSelectedUser({
                                                ...selectedUser,
                                                role: e.target.value,
                                            })
                                        }
                                        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="">
                                            Select Role
                                        </option>

                                        {roles.map((role) => (
                                            <option key={role} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                {/* STATUS */}
                                <div>
                                    <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Status
                                    </Label>

                                    <select
                                        value={selectedUser.status || ""}
                                        onChange={(e) =>
                                            setSelectedUser({
                                                ...selectedUser,
                                                status: e.target.value,
                                            })
                                        }
                                        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="">
                                            Select Status
                                        </option>

                                        {status.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                {/* REFERRED BY */}
                                <div>
                                    <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Referred By
                                    </Label>

                                    <Input
                                        type="text"
                                        value={selectedUser.referredby || ""}
                                        onChange={(e) =>
                                            setSelectedUser({
                                                ...selectedUser,
                                                referredby: e.target.value,
                                            })
                                        }
                                        className="rounded-lg border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter referred by"
                                    />
                                </div>

                            </div>

                        </div>


                        {/* MODAL FOOTER */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">

                            <Button
                                variant="outline"
                                className="rounded-lg border border-slate-300 bg-white px-5 text-slate-700 shadow-sm hover:bg-slate-50"
                                size="sm"
                                type="button"
                                onClick={closeModal}
                            >
                                Cancel
                            </Button>

                            <Button
                                className="rounded-lg bg-blue-600 px-5 text-white shadow-sm transition-colors hover:bg-blue-700"
                                size="sm"
                                type="button"
                                onClick={handleSave}
                            >
                                {isEditMode
                                    ? "Save Changes"
                                    : "Add User"}
                            </Button>

                        </div>

                    </form>

                </div>

            </Modal>
        </>
    );
}
