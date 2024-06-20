const Branch = require("../model/branchModel");

const branchRegistration = async (req, res) => {
    const {
        branch_id,
        branch_name,
        branch_city,
        branch_state,
        branch_pincode,
        branch_address,
        branch_phoneNO
    } = req.body;

    if (!branch_name || !branch_city || !branch_state || !branch_pincode || !branch_address || !branch_phoneNO) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    try {
        const newBranch = new Branch({
            branch_name,
            branch_id,
            branch_city,
            branch_state,
            branch_pincode,
            branch_address,
            branch_phoneNO
        });

        const result = await newBranch.save();
        if (!result) {
            return res.status(400).json({ message: "An error occurred during registration" });
        }
        res.status(200).json({ message: "Branch registered successfully", result });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const getAllBranch = async (req, res) => {
    try {
        const branches = await Branch.find();
        res.status(200).json({ message: "Get all branches successfully", data: branches });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const getbranchById = async (req, res) => {
    const { id } = req.params;
    try {
        const branch = await Branch.findById(id);
        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }
        res.status(200).json({ message: "Branch retrieved successfully", data: branch });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const updateBranch = async (req, res) => {
    const { id } = req.params;
    const {
        branch_id,
        branch_name,
        branch_city,
        branch_state,
        branch_pincode,
        branch_address,
        branch_phoneNO
    } = req.body;

    try {
        const updatedBranch = await Branch.findByIdAndUpdate(id, {
            branch_name,
            branch_id,
            branch_city,
            branch_state,
            branch_pincode,
            branch_address,
            branch_phoneNO
        }, { new: true });

        if (!updatedBranch) {
            return res.status(404).json({ message: "Branch not found" });
        }

        res.status(200).json({ message: "Branch updated successfully", data: updatedBranch });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const deleteBranch = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBranch = await Branch.findByIdAndDelete(id);

        if (!deletedBranch) {
            return res.status(404).json({ message: "Branch not found" });
        }

        res.status(200).json({ message: "Branch deleted successfully", data: deletedBranch });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = { branchRegistration, getAllBranch, getbranchById, updateBranch, deleteBranch };
