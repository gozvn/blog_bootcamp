const responseUtils = require("utils/responseUtils")

const uploadController = {
    uploadImage: async (req, res) => {
        try {
            const file = req.file;
            if (!file) {
                return responseUtils.error(res, "No file uploaded");
            }
            const relativePath = file.path.replace(/\\/g, '/');
            const url = `${req.protocol}://${req.get('host')}/${relativePath}`;
            return responseUtils.ok(res, {
                file,
                url
            }, "File uploaded successsfully");
        } catch (error) {
            return responseUtils.error(res, error)
        }
    }

}

module.exports = uploadController;
