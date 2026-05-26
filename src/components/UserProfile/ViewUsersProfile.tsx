import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { useEffect, useState } from "react";
import api from "../../common/axiosConfig.tsx";
import {useModal} from "../../hooks/useModal.ts";
import {Modal} from "../ui/modal";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import Button from "../ui/button/Button.tsx";
import Badge from "../ui/badge/Badge.tsx";

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
    const [selectedUser, setSelectedUser] =  useState<any>(emptyUser);
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
            <div className="p-4 text-gray-500">
                Loading ...
            </div>
        );
    }

    return (
        <>
        <div className="overflow-visible rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

                <div className="flex flex-wrap gap-4 p-4">
                    <Button
                        onClick={() => {
                            setSelectedUser(emptyUser);
                            setIsEditMode(false);
                            openModal();
                        }}
                    >
                        Add User
                    </Button>
                </div>

            <div className="max-w-full overflow-x-auto">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="px-5 py-4 sm:px-6 text-start text-theme-sm"
                            >
                                Id
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-4 sm:px-6 text-start text-theme-sm"
                            >
                                User Name
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-4 sm:px-6 text-start text-theme-sm"
                            >
                                Name
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Address
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Phone Number
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Email Id
                            </TableCell>

                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Role
                            </TableCell>

                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Status
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Service Start Date
                            </TableCell>

                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Service End Date
                            </TableCell>

                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-start text-theme-sm"
                            >
                                Referred By
                            </TableCell>




                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-40">
                                    {user.id}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-40">
                                    {user.username}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-40">
                                    {user.fullname}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {user.address}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {user.phonenumber}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {user.emailid}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {user.role}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">

                                    <Badge
                                        size="sm"
                                        color={
                                            (() => {
                                                if (user.status?.toLowerCase() === "active")
                                                    return "success";

                                                if (user.status?.toLowerCase() === "inactive")
                                                    return "error";

                                                return "warning";
                                            })()
                                        }
                                    >
                                        {user.status}
                                    </Badge>



                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {user.startdate}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {user.enddate}
                                </TableCell>
                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {user.referredby}
                                </TableCell>

                                <TableCell
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">

                                <button
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setIsEditMode(true);
                                        openModal();
                                    }}
                                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                                >
                                    <svg
                                        className="fill-current"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                            fill=""
                                        />
                                    </svg>
                                    Edit
                                </button>

                                </TableCell>





                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

        </div>

    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    {isEditMode ? "Update User Profile" : "Add New User"}
                </h4>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                    Update User details to keep your profile up-to-date.
                </p>
            </div>
            <form className="flex flex-col">
                <div className="px-2 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                        <div>
                            <Label>Full Name</Label>
                            <Input
                                type="text"
                                value={selectedUser.fullname || ""}
                                onChange={(e) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        fullname: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Username</Label>
                            <Input
                                type="text"
                                value={selectedUser.username || ""}
                                onChange={(e) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        username: e.target.value
                                    })
                                }
                            />
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={selectedUser.password || ""}
                                onChange={(e) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        password: e.target.value
                                    })
                                }
                            />
                        </div>
                        <div>
                            <Label>Address</Label>
                            <Input
                                type="text"
                                value={selectedUser.address || ""}
                                onChange={(e) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        address: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Phone Number</Label>
                            <Input
                                type="text"
                                value={selectedUser.phonenumber || ""}
                                onChange={(e) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        phonenumber: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={selectedUser.emailid || ""}
                                onChange={(e) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        emailid: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label>Role</Label>
                         {/*   <Input
                                type="text"
                                value={selectedUser.role || ""}
                                onChange={(e) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        role: e.target.value
                                    })
                                }
                            />*/}
                            <select
                                value={selectedUser.role || ""}
                                onChange={(e) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        role: e.target.value
                                    })
                                }
                                className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2"
                            >
                                <option value="">Select Role</option>

                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label>Status</Label>

                            <select
                                value={selectedUser.status || ""}
                                onChange={(e) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        status: e.target.value
                                    })
                                }
                                className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2"
                            >
                                <option value="">Select Status</option>

                                {status.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label>Referred By</Label>
                            <Input
                                type="test"
                                value={selectedUser.referredby || ""}
                                onChange={(e) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        referredby: e.target.value
                                    })
                                }
                            />
                        </div>

                    </div>
                </div>

                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={closeModal}
                    >
                        Close
                    </Button>

                    <Button
                        size="sm"
                        onClick={handleSave}
                    >
                        {isEditMode ? "Save Changes" : "Add User"}
                    </Button>
                </div>
            </form>
        </div>
    </Modal>
</>
    );
}

