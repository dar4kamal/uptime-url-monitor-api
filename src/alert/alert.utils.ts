export const getVerifyEmailTemplate = (verifyUrl: string) => {
  return `<div style="font-family: Helvetica, Arial, sans-serif; line-height: 2">
    <div style="margin-left: 30px; width: 70%; padding: 20px 0">
      <p style="font-size: 1.1em">Hi,</p>
      <p>Thank you for choosing to work with our API services.</p>
      <p>
        We just need to verify your email address before you can access our
        services.
      </p>
      <div style="display: flex; align-items: center; justify-content: center">
        <a
          target="_blank"
          href="${verifyUrl}"
          style="
            background: #00466a;
            color: #fff;
            border-radius: 5px;
            font-size: medium;
            padding: 5px 10px 5px 10px;
            text-decoration: none;
          "
        >
          Verify Email
        </a>
      </div>
      <p style="font-size: 0.9em">
        Regards,<br />Your Favourite API Service ❤️❤️
      </p>
    </div>
  </div>`;
};
