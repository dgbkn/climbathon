addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Access-Control-Allow-Headers": "Content-Type",
};

function standardizePhoneNumber(phoneNumber) {
  phoneNumber = phoneNumber.replace(/\+|91/g, "");
  return phoneNumber;
}

function isValidIndianPhoneNumber(phoneNumber) {
  const regex = /^(?:\+91|91)?[0-9]{10}$/;
  return regex.test(phoneNumber);
}

async function handleRequest(request) {
  try {
    // Check if the request method is POST
    if (request.method === "POST") {
      const formData = await request.formData();

      // Access the submitted form data
      const entry1 = formData.get("name");
      const entry2 = formData.get("email");
      const entry3 = formData.get("age");
      var entry4 = "9419141230";
      // var entry4 = formData.get("phone");
      // const entry5 = formData.get("gender");
      const entry5 = "Male";

      const entry6 = "Yes";

      // const entry7 = formData.get("clgName");
      const entry7 = "na";
      const entry8 = "na";
      // const entry8 = formData.get("sclName");
      // const entry10 = formData.get("m4");
      const entry9 = "https://dr1.com";
      const entry10 = "https://dr2.com";
      // const entry11 = formData.get("ss");
      const entry11 = formData.get("rno");
      // const entry13 = formData.get("ss");
      const entry12 = "https://dr3.com";
      const entry13 = formData.get("trnID");
      // var entry14 = formData.get("trnPhone");
      var entry14 = "9419141230";

      // const entry16 = formData.get("ss");
      const entry15 = "Gpay";
      // const entry16 = formData.get("ss");
      const entry16 = "5km";
      console.log(entry4, entry14);
      // if (isValidIndianPhoneNumber(entry4) && isValidIndianPhoneNumber(entry14)) { // Standardize the phone number
      //     entry4 = standardizePhoneNumber(entry4);
      //     entry14 = standardizePhoneNumber(entry14);
      // } else {
      //     const errorResponse = {
      //         error: "Invalid phone number"
      //     };
      //     return new Response(JSON.stringify(errorResponse), {
      //         status: 200,
      //         headers: {
      //             "Content-Type": "application/json",
      //             ... corsHeaders
      //         }
      //     });
      // }

      // Submit the incoming data to an external Google Form
      await submitToGoogleForm(
        entry1,
        entry2,
        entry3,
        entry4,
        entry5,
        entry6,
        entry7,
        entry8,
        entry9,
        entry10,
        entry11,
        entry12,
        entry13,
        entry14,
        entry15,
        entry16
      );

      const successResponse = {
        success: "Form data received and submitted successfully",
      };
      return new Response(JSON.stringify(successResponse), {
        status: 200,
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
        status: 200,
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
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
}

async function submitToGoogleForm(
  entry1,
  entry2,
  entry3,
  entry4,
  entry5,
  entry6,
  entry7,
  entry8,
  entry9,
  entry10,
  entry11,
  entry12,
  entry13,
  entry14,
  entry15,
  entry16
) {
  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSfxIRlBfpbJ6QS0JLh2bdy7-PZ1Fe5WlANecsHFOF6_RDUWvQ/formResponse";

  const urlencoded = new FormData();

  urlencoded.append("entry.807911514", entry1);
  urlencoded.append("entry.1190147616", entry2);
  urlencoded.append("entry.519431154", entry3);
  urlencoded.append("entry.1592595101", entry4);
  urlencoded.append("entry.1193926513", entry5);
  urlencoded.append("entry.875091108", entry6);
  urlencoded.append("entry.31134898", entry7);
  urlencoded.append("entry.463664041", entry8);
  urlencoded.append("entry.1672731479", entry9);
  urlencoded.append("entry.335192038", entry10);
  urlencoded.append("entry.934455295", entry11);
  urlencoded.append("entry.621779747", entry12);
  urlencoded.append("entry.1182897846", entry13);
  urlencoded.append("entry.316715673", entry14);
  urlencoded.append("entry.149016326", entry15);
  urlencoded.append("entry.1989279340", entry16);

//   urlencoded.append("entry.1182897846_sentinel", "");
//   urlencoded.append("entry.316715673_sentinel", "");
//   urlencoded.append("entry.149016326_sentinel", "");
//   urlencoded.append("entry.1989279340_sentinel", "");

  const response = await fetch(formUrl, {
    method: "POST",
    body: urlencoded,
  });

  if (response.ok) {
    console.log("Form data submitted successfully to the external Google Form");
  } else {
    throw new Error("Failed to submit data to the external Google Form");
  }
}
