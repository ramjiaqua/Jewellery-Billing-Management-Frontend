import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import {SHOP_NAME} from "../../common/constants";
import {useState} from "react";
import ComponentCard from "../../components/common/ComponentCard";
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
            <PageBreadcrumb pageTitle="Update Gold & Silver Rate"/>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                <div className="space-y-6">
                    <ComponentCard title="Today's Rate">
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="gold_rate">Gold Rate</Label>
                                <Input type="text" id="gold_rate" name="goldRate" value={formData.goldRate || ""}
                                       onChange={handleChange} placeholder="Enter Gold Price Per Gram"/>
                            </div>
                            <div>
                                <Label htmlFor="silver_rate">Silver Rate</Label>
                                <Input type="text" id="silver_rate" name="silverRate"
                                       value={formData.silverRate || ""} onChange={handleChange}
                                       placeholder="Enter Silver Price Per Gram"/>
                            </div>
                        </div>
                    </ComponentCard>
                </div>
                <div>
                    <Button className="flex items-center gap-5" size="sm" type="button" disabled={loading}
                            onClick={handleUpdateRate}>
                        {loading ? "Updating..." : "Update Rate"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
