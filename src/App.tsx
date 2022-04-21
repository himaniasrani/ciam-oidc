import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import jwt_decode from "jwt-decode";
// import {
//     generateCodeChallengeFromVerifier,
//     generateCodeVerifier,
// } from "./utils/index";

const codeVerifier =
    "hkoO3~j4~18XUA3iJkkJqdI8qfP98.sc8hKL48W6FlxlihlpLB1MbfLjMlLm7fnY9voa8_op8EpWCgdbIwfPWDzuSLuaDDa68SpkZ_7m40eDJeCAKMWqsrFYmSbxNfgi";
const codeChallenge = "_k1W_xDVp_9zLHF90NLkZDbE41R4LhpMRrhRU0rQNhQ";
const client_id = "436c0950-a373-013a-7061-0234d2b88adb155934";
const SCOPE = "openid profile email";
const STATE = "1211212";
const CALLBACK_URL = "https://ciam-oidc.pages.dev";

function App() {
    const [userData, setUserData] = useState<any>();
    const [userInfo, setUserInfo] = useState<any>();
    const authURL = `https://gshrishi-dev.onelogin.com/oidc/2/auth?response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256&client_id=${client_id}&redirect_uri=${CALLBACK_URL}&scope=${SCOPE}&state=${STATE}`;

    useEffect(() => {
        const code = new URLSearchParams(
            window.location.search.split("").slice(1).join("")
        ).get("code");
        if (code) {
            let params = qs.stringify( {
                grant_type: "authorization_code",
                client_id: client_id,
                code_verifier: codeVerifier,
                code: code,
                redirect_uri: CALLBACK_URL,
              } );
            axios
                .post("https://gshrishi-dev.onelogin.com/oidc/2/token", params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then((data) => {
                    setUserData(data);
                    setUserInfo(jwt_decode(data['data']['id_token']));
                });
        }
        else{
            window.location.href = authURL;
        }
    }, []);
    return (
        <div>
            {/* {userData ? (
                <div>{JSON.stringify(userData)}</div>
            ) : (
                <a href={authURL}> Click here</a>
            )}{" "} */}
            {userData && userInfo && (
                <div>
                    <h2>Hello {userInfo['name']}!</h2>
                    <h3>Email : {userInfo['email']}</h3>
                </div>
            )}
        </div>
    );
}

export default App;
