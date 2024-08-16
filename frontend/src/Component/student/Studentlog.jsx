import React, { useEffect } from 'react';

const Studentlog = () => {
    useEffect(() => {
        // Load the external script
        const script = document.createElement('script');
        script.src = "https://www.phone.email/sign_in_button_v1.js";
        script.async = true;
        document.querySelector('.pe_signin_button').appendChild(script);

        // Define the listener function
        window.phoneEmailListener = async function(userObj) {
            const user_json_url = userObj.user_json_url;

            // Fetch user details from the backend
            try {
                const response = await fetch('/Login');
                const data = await response.json();

                // Process and display user details
                console.log('User Details:', data);

                // Insert the debug message
                document.querySelector('.pe_signin_button').insertAdjacentHTML('beforeend', `<span>Phone Verification Successful !! <br />Read the following user_json_url from the backend to get the verified phone number - ${user_json_url} <br /> Please delete this debug message code from the phoneEmailListener function once you implement integration step 2.</span>`);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        return () => {
            // Cleanup the listener function when the component unmounts
            window.phoneEmailListener = null;
        };
    }, []);

    return (
        <div>
            <div className="pe_signin_button" data-client-id="11311996603681884971">
                <script src="https://www.phone.email/sign_in_button_v1.js" async></script>
            </div>
            <div className="pe_signin_button" data-client-id="15695407177920574360"></div>
        </div>
    );
};

export default Studentlog;