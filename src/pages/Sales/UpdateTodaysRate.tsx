import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import {SHOP_NAME} from "../../common/constants";
import {useState} from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import api from "../../common/axiosConfig";
import { useNavigate } from "react-router-dom";
export default function UpdateTodaysRate() {
    const [formData, setFormData] = useState({
        goldRate: "",
        silverRate: "",
        rateDate: ""
    });
    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    const handleUpdateRate = async () => {
        try {
            // ✅ VALIDATION (ADD HERE - FIRST THING)
            if (!formData.goldRate || !formData.silverRate) {
                alert("Please Enter Rates.");
                return;
            }

            if (Number(formData.goldRate) <= 0) {
                alert("Invalid Gold Rate.");
                return;
            }

            if (Number(formData.silverRate) <= 0) {
                alert("Invalid Silver Rate.");
                return;
            }

            setLoading(true);
            const finalFormData = {
                goldRate: Number(formData.goldRate),
                silverRate: Number(formData.silverRate)
            };

            await api.post("/api/rate", finalFormData);
            alert("Rate updated successfully");
// ✅ redirect to home
            navigate("/home");
            window.location.reload();

        } catch (error) {
            console.error(error);
            alert("Failed to update rate");
        } finally {
            setLoading(false);
        }

    };


    return (
        <div>
            <PageMeta
                title={SHOP_NAME}
                description={SHOP_NAME}
            />

            <PageBreadcrumb pageTitle="Update Gold & Silver Rate" />

            <div
                className="
            rounded-3xl
            border
            border-yellow-300
            bg-gradient-to-br
            from-[#FFFDF7]
            via-white
            to-[#FFF8E8]
            shadow-xl
            overflow-hidden
        "
            >
                {/* Header */}
                <div
                    className="
                p-6
                bg-gradient-to-r
                from-yellow-500
                via-amber-500
                to-yellow-600
            "
                >
                    <h2 className="text-3xl font-bold text-white">
                        💰 Update Today's Rate
                    </h2>

                    <p className="text-yellow-100 mt-1">
                        Update Gold & Silver rates for today's billing.
                    </p>
                </div>

                {/* Form */}
                <div className="p-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <Label
                                htmlFor="gold_rate"
                                className="text-yellow-700 font-semibold"
                            >
                                Gold Rate (Per Gram)
                            </Label>

                            <Input
                                id="gold_rate"
                                type="text"
                                name="goldRate"
                                value={formData.goldRate}
                                onChange={handleChange}
                                placeholder="Enter Gold Price"

                                className="
                            rounded-xl
                            border-yellow-300
                            bg-yellow-50
                            focus:border-yellow-500
                            focus:ring-2
                            focus:ring-yellow-300
                        "
                            />
                        </div>

                        <div>
                            <Label
                                htmlFor="silver_rate"
                                className="text-yellow-700 font-semibold"
                            >
                                Silver Rate (Per Gram)
                            </Label>

                            <Input
                                id="silver_rate"
                                type="text"
                                name="silverRate"
                                value={formData.silverRate}
                                onChange={handleChange}
                                placeholder="Enter Silver Price"

                                className="
                            rounded-xl
                            border-yellow-300
                            bg-yellow-50
                            focus:border-yellow-500
                            focus:ring-2
                            focus:ring-yellow-300
                        "
                            />
                        </div>

                    </div>

                    {/* Button */}

                    <div className="mt-8 flex justify-end">

                        <Button
                            size="sm"
                            type="button"
                            disabled={loading}
                            onClick={handleUpdateRate}
                            className="
                        px-8
                        py-3
                        rounded-xl
                        bg-gradient-to-r
                        from-yellow-500
                        to-amber-600
                        text-white
                        font-semibold
                        shadow-lg
                        hover:shadow-xl
                        hover:scale-105
                        transition-all
                        disabled:opacity-50
                    "
                        >
                            {loading ? (
                                <>Updating...</>
                            ) : (
                                <>💾 Update Rate</>
                            )}
                        </Button>

                    </div>

                </div>
            </div>
        </div>
    );
}
