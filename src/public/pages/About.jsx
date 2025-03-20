import React from "react";
import img from "/about.jpg";

const About = () => {
    return (
        < div className="max-h-[78vh] overflow-y-auto">
            {/* Hero Section */}
            <div
                className="relative bg-cover  bg-center h-80 md:h-80 flex items-center justify-center text-center px-20 md:px-10"
                style={{ backgroundImage: `url(${img})` }}
            >
                <div className="absolute inset-0 bg-black opacity-20"></div>
                {/* Heading on background */}
                <div className="relative z-10 max-w-4xl text-white space-y-4 md:space-y-6 text-center">
                    <h1 className="text-3xl md:text-3xl lg:text-4xl font-extrabold uppercase">
                        About Us
                    </h1>
                    <p>Welcome to Just CheckIn, a government-backed platform designed to make hotel registration secure, seamless, and efficient.</p>
                </div>
            </div>

            {/* Privacy & Policy and Terms & Conditions */}
            <div className="max-w-4xl mx-9 p-6 text-black">
                <h2 className="text-2xl font-semibold mb-4">Privacy & Policy</h2>
                <p className="text-sm text-black">Effective Date: 1/1/2025</p>
                <p className="mt-4">Welcome to Just CheckIn. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information while using our service.</p>

                <h3 className="text-lg font-semibold mt-6">1. Information We Collect</h3>
                <p className="mt-4">We collect the following information from users:</p>
                <ul className="list-disc m-4 pl-8">
                    <li> Aadhaar Number (for verification purposes)</li>
                    <li>One-Time Password (OTP) for authentication</li>
                    <li> Contact Information (such as phone number)</li>
                    <li>Usage Data (such as IP address, device type, and browser information)</li>
                </ul>

                <h3 className="text-lg font-semibold mt-6">2. How We Use Your Information</h3>
                <p className="mt-4">We use your information to:
                </p>

                <ul className="list-disc  mt-4 pl-8">
                    <li>Verify your identity using Aadhaar authentication</li>
                    <li>Provide access to our services</li>
                    <li> Improve security and prevent fraud</li>
                    <li>Comply with legal requirements</li>
                </ul>

                <h3 className="text-lg font-semibold mt-6">3. Data Security</h3>
                <p>We implement appropriate security measures to protect your personal data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>

                <h3 className="text-lg font-semibold mt-6">4. Sharing of Information</h3>
                <p>We do not sell or share your personal data with third parties, except:</p>
                <ul className="list-disc  mt-4 pl-8">
                    <li> When required by law or government authorities</li>
                    <li> To trusted service providers who assist in our operations (under confidentiality agreements)
                    </li>
                </ul>

                <h3 className="text-lg font-semibold mt-6">5. Retention of Data</h3>
                <p>We retain your data only for as long as necessary to fulfill the purposes outlined in this policy. Once verification is complete, your Aadhaar number and OTP are not stored.</p>

                <h3 className="text-lg font-semibold mt-6">6. Your Rights</h3>
                <p>You have the right to access, correct, or delete your personal data. You may contact us for any privacy-related concerns.
                </p>

                <h3 className="text-lg font-semibold mt-6">7. Changes to this Privacy Policy</h3>
                <p>We may update this policy periodically. Continued use of our website implies acceptance of any changes.
                </p>


                <h3 className="text-lg font-semibold mt-6">8. Contact Us</h3>
                <p>For any questions regarding this Privacy Policy, please contact us at [Insert Contact Information].
                </p>

                <h2 className="text-2xl font-bold mt-8">Terms & Conditions</h2>
                <p className="text-lg text-black mt-4">Effective Date: 1/1/2025</p>
                <p className="mt-4">Welcome to Just Check In. By using our website, you agree to comply with the following terms and conditions.

                </p>

                <h3 className="text-lg font-semibold mt-6">1. Acceptance of Terms</h3>
                <p>By accessing Just Check In, you acknowledge and agree to these terms. If you do not agree, please do not use our services.

                </p>

                <h3 className="text-lg font-semibold mt-6">2. Use of Service
                </h3>
                <ul className="list-disc pl-8">
                    <li>The service is intended for user verification through Aadhaar-based authentication.
                    </li>
                    <li>You must provide accurate and truthful information during the verification process.
                    </li>
                    <li>Unauthorized use or attempt to access another user’s information is prohibited.
                    </li>

                </ul>
                <h3 className="text-lg font-semibold mt-6">3. User Responsibilities

                </h3>

                <ul className="list-disc pl-8">
                    <li> You are responsible for maintaining the confidentiality of your OTP.

                    </li>
                    <li> Any unauthorized access due to negligence in handling your credentials is not our responsibility.

                    </li>


                </ul>


                <h3 className="text-lg font-semibold mt-6">4. Prohibited Activities*


                </h3>
                <p className="mt-4">You agree not to:</p>

                <ul className="list-disc pl-8">
                    <li>  Use the website for any unlawful activities


                    </li>
                    <li> Attempt to breach the security or integrity of our platform


                    </li>
                    <li> Provide false or misleading information
                    </li>


                </ul>

                <h3 className="text-lg font-semibold mt-6">5. Limitation of Liability



                </h3>
                <p className="mt-4">Just Check In is not responsible for:
                </p>

                <ul className="list-disc pl-8">
                    <li>  Any unauthorized access due to user negligence



                    </li>
                    <li> Errors in Aadhaar authentication caused by third-party systems



                    </li>
                    <li>  Temporary unavailability of the website due to maintenance or technical issues

                    </li>


                </ul>




                <h3 className="text-lg font-semibold mt-6">6. Changes to Terms
                </h3>
                <p>We reserve the right to update these terms at any time. Continued use of the website after changes implies acceptance.
                </p>

                <h3 className="text-lg font-semibold mt-6">7. Termination of Access

                </h3>
                <p>We may suspend or terminate access if any user violates these terms.

                </p>

                <h3 className="text-lg font-semibold mt-6">8. Contact Us


                </h3>
                <p>For any queries regarding these Terms & Conditions, contact us at 9621345050.


                </p>

                <p className="mt-8">By using Just Check In, you agree to these Terms & Conditions and our Privacy Policy.
                </p>


            </div>
        </div>
    );
};

export default About;