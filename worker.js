addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "HEAD, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Access-Control-Allow-Headers": "Content-Type",
};

function standardizePhoneNumber(phoneNumber) {
  phoneNumber = phoneNumber.replace(/\+|91/g, "");
  return phoneNumber;
}

function isValidIndianPhoneNumber(phoneNumber) {
  const regex = /^[0-9]{10}$/;
  return regex.test(phoneNumber);
}

async function handleRequest(request) {
  try {
    // Check if the request method is POST
    if (request.method === "POST") {
      const formData = await request.formData();

      // Verify required fields
      var requiredFields = [
        "name",
        "email",
        "age",
        "phone",
        "gender",
        "category",
        "distance",
      ];
      for (const field of requiredFields) {
        if (!formData.has(field) || formData.get(field).trim() === "") {
          const errorResponse = {
            error: `Missing required field: ${field}`,
          };
          return new Response(JSON.stringify(errorResponse), {
            status: 400, // Bad Request
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          });
        }
      }

      var studentIdUrl = formData.get("studentIdUrl"); // image
      var govIdUrl = formData.get("govIdUrl"); // image
      var ssPaymentUrl = formData.get("ssPaymentUrl");

      switch (formData.get("category")) {
        case "Thapar Student":
          if (!formData.get("rno") || formData.get("rno").trim() === "") {
            const errorResponse = {
              error: `Missing required field: Roll No.`,
            };
            return new Response(JSON.stringify(errorResponse), {
              status: 400, // Bad Request
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
              },
            });
          }

          if (!formData.get("studentIdUrl") || formData.get("studentIdUrl") === "N/A") {
            const errorResponse = {
              error: `Missing required field: Student ID`,
            };
            return new Response(JSON.stringify(errorResponse), {
              status: 400, // Bad Request
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
              },
            });
          }
          break;

        case "Non Thapar Student":
          // Verify required payment fields

          requiredFields = [
            "trnID",
            "trnPhone",
            "ssPaymentUrl",
            "gateway",
          ];

          for (const field of requiredFields) {
            if (!formData.has(field) || formData.get(field).trim() === "") {
              const errorResponse = {
                error: `Missing required field: ${field}`,
              };
              return new Response(JSON.stringify(errorResponse), {
                status: 400, // Bad Request
                headers: {
                  "Content-Type": "application/json",
                  ...corsHeaders,
                },
              });
            }
          }

          break;
      }

      // Optional fields
      const clgName = formData.get("clgName");
      const schoolName = formData.get("sclName");
      const rNo = formData.get("rno");

      // image

      // Validate phone number
      const contact = standardizePhoneNumber(formData.get("phone"));
      const trnPhone = standardizePhoneNumber(formData.get("trnPhone"));

      // Call the submitToGoogleForm function with the verified and formatted data
      await submitToGoogleForm(
        formData.get("name"),
        formData.get("email"),
        formData.get("age"),
        contact,
        clgName,
        schoolName,
        studentIdUrl,
        govIdUrl,
        rNo,
        ssPaymentUrl,
        formData.get("trnID"),
        trnPhone,
        formData.get("gender"),
        formData.get("category"),
        formData.get("gateway"),
        formData.get("distance")
      );

      const successResponse = {
        success: "Form data received and submitted successfully",
      };
      return new Response(JSON.stringify(successResponse), {
        status: 200, // OK
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } else {
      // Handle other HTTP methods
      const errorResponse = {
        error: "Only POST requests are supported",
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 405, // Method Not Allowed
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
  } catch (error) {
    // Handle errors
    const errorResponse = {
      error: `Error: ${error.message}`,
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 500, // Internal Server Error
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
}

function generateUniqueUID(name, email) {
  const dataToEncode = `${name}#${email}`;
  const encodedData = btoa(dataToEncode);
  return encodedData;
}

async function submitToGoogleForm(
  name,
  email,
  age,
  contact,
  clgName,
  schoolName,
  studentIdUrl,
  govIdUrl,
  rNo,
  ssPaymentUrl,
  tId,
  paymentPhone,
  gender,
  studentCategory,
  paymentGateway,
  runningDistance
) {
  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSfxIRlBfpbJ6QS0JLh2bdy7-PZ1Fe5WlANecsHFOF6_RDUWvQ/formResponse";

  const urlencoded = new FormData();

  urlencoded.append("entry.807911514", name);
  urlencoded.append("entry.1190147616", email);
  urlencoded.append("entry.519431154", age);
  urlencoded.append("entry.1592595101", contact || "n/a");
  urlencoded.append("entry.1193926513", clgName || "n/a");
  urlencoded.append("entry.875091108", schoolName || "n/a");
  urlencoded.append("entry.31134898", studentIdUrl || "n/a");
  urlencoded.append("entry.463664041", govIdUrl || "n/a");
  urlencoded.append("entry.1672731479", rNo || "n/a");
  urlencoded.append("entry.335192038", ssPaymentUrl || "n/a");
  urlencoded.append("entry.934455295", tId || "n/a");
  urlencoded.append("entry.621779747", paymentPhone || "n/a");
  urlencoded.append("entry.1182897846", gender || "n/a");
  urlencoded.append("entry.316715673", studentCategory || "n/a");
  urlencoded.append("entry.149016326", paymentGateway || "n/a");
  urlencoded.append("entry.1989279340", runningDistance || "n/a");

  const response = await fetch(formUrl, {
    method: "POST",
    body: urlencoded,
  });

  if (response.ok) {
    // Send email
    const uid = generateUniqueUID(name, email);

    const emailEndpoint = `https://goyalinfocom.com/google_api/sent_mail.php?uid=${uid}&sendto=${encodeURIComponent(
      email
    )}`;
    await fetch(emailEndpoint);

    console.log("Form data submitted successfully to the external Google Form");
  } else {
    // console.log(await response.text());
    throw new Error("Failed to submit data some error occurred");
  }
}
