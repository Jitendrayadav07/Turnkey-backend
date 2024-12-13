// import module/package
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var cors = require('cors');
const { Turnkey } = require("@turnkey/sdk-server");
// setting middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
require("dotenv").config();

// setting error path


const turnkey = new Turnkey({
    apiBaseUrl: "https://api.turnkey.com",
    apiPrivateKey: "0af8f76e98e9365e948e2bc0e04b71c83a4d95d5469cecdabcd228ddbd66745e",
    apiPublicKey: "02dd9931b147f71bde07c4c8901b8a17804babac13e2d57dc41e32e52717d99297",
    defaultOrganizationId: "ceddd4dd-272e-4e38-bd79-40401694ccef",
});

const apiClient = turnkey.apiClient();


app.post("/create-sub-organization", async (req, res) => {
    try {
        console.log(req.body);
        const subOrganizationResponse = await apiClient.createSubOrganization(
            req.body.organizationBody
        );
        res.status(200).json({success: true,data: subOrganizationResponse,message: "Works",statusCode: 200
        });
    } catch (error) {
        console.log('Turnkey error:', error.message);
        res.status(500).json({success: false,data: null,message: error.message,statusCode: 500
        });
    }
});

app.post("/generate-otp", async (req, res) =>{
    try{
        
        //   const initOtpAuthResponse = await apiClient.initOtpAuth({
        //     contact: "ashishc0046@gmail.com",
        //     otpType: "OTP_TYPE_EMAIL",
        //     // This is simple in the case of a single organization.
        //     // If you use sub-organizations for each user, this needs to be replaced by the user's specific sub-organization.
        //     organizationId:
        //       "38ec9f70-8dbe-4bd3-8b99-953a171a329c",
            
        //   });

        const initOtpAuthResponse = await apiClient.initOtpAuth({
            contact: "ashishc0046@gmail.com",
            otpType: process.env.OTP_TYPE_EMAIL,
            // This is simple in the case of a single organization.
            // If you use sub-organizations for each user, this needs to be replaced by the user's specific sub-organization.
            organizationId:req.body.organizationId,
        });
      
          const { otpId } = initOtpAuthResponse;

          console.log(initOtpAuthResponse, "initn")
      
          if (!otpId) {
            throw new Error("Expected a non-null otpId.");
          }
      
          res.status(200).send(Response.sendResponse(true, initOtpAuthResponse, "Works", 200))
    }catch(err) {
        console.log(err)
    }
})

app.post("/verify-otp", async (req, res) => {
    try{
        // otpId: string;
    // otpCode: string;
        const resp = await apiClient.otpAuth({otpId: "864951e5-f496-4a24-b951-8d25a4754473", otpCode: "995011",  targetPublicKey: "04afff3e2c8a5ca6129883e3a82b7d0772f42b3d8612831d6b12f812bbbbf3430665ffe47feb63b542acc7c15f1cf823acdb643551c5ccef900d6a3549289fb08a", organizationId:
            "38ec9f70-8dbe-4bd3-8b99-953a171a329c"})
        console.log(resp)
    }catch(err) {
        console.log(err)
    }
})

app.use((req, res, next) => {
    const err = new Error(`${req.url} not found in this server`);
    err.status = 404;
    next(err);
});

const PORT = process.env.PORT || 45000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});