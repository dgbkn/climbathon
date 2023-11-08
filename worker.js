addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event.request));
  });

  
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'HEAD, POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  function standardizePhoneNumber(phoneNumber) {
    phoneNumber = phoneNumber.replace(/\+|91/g, '');
    return phoneNumber;
  }
  
  function isValidIndianPhoneNumber(phoneNumber) {
    const regex = /^(?:\+91|91)?[0-9]{10}$/;
    return regex.test(phoneNumber);
  }
  
  async function handleRequest(request) {
    try {
      // Check if the request method is POST
      if (request.method === 'POST') {
        const formData = await request.formData();
  
        // Verify required fields
        const requiredFields = ['name', 'email', 'age', 'phone', 'trnID', 'trnPhone', 'gender', 'category', 'gateway', 'distance'];
        for (const field of requiredFields) {
          if (!formData.has(field)) {
            const errorResponse = {
              error: `Missing required field: ${field}`,
            };
            return new Response(JSON.stringify(errorResponse), {
              status: 400, // Bad Request
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
              },
            });
          }
        }

        if(formData.get('category') === 'Non Thapar Student' && !formData.has('sclName')) {
            const errorResponse = {
                error: `Missing required field: sclName`,
            };
            return new Response(JSON.stringify(errorResponse), {
                status: 400, // Bad Request
                headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
                },
            });
        }
  
        // Optional fields
        const clgName = formData.get('clgName') || "N/A";
        const schoolName = formData.get('sclName') || "N/A";
        const rNo = formData.get('rno');
        const studentIdUrl = formData.get('studentIdUrl') || ''; // image
        const govIdUrl = formData.get('govIdUrl') || ''; // image
        const ssPaymentUrl = formData.get('ssPayment') || ''; // image
  
        // Validate phone number
        const contact = standardizePhoneNumber(formData.get('phone'));
        if (!isValidIndianPhoneNumber(contact)) {
          const errorResponse = {
            error: 'Invalid phone number',
          };
          return new Response(JSON.stringify(errorResponse), {
            status: 400, // Bad Request
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          });
        }
  
        // Call the submitToGoogleForm function with the verified and formatted data
        await submitToGoogleForm(
          formData.get('name'),
          formData.get('email'),
          formData.get('age'),
          contact,
          clgName,
          schoolName,
          studentIdUrl,
          govIdUrl,
          rNo,
          ssPaymentUrl,
          formData.get('trnID'),
          formData.get('trnPhone'),
          formData.get('gender'),
          formData.get('category'),
          formData.get('gateway'),
          formData.get('distance')
        );
  
        const successResponse = {
          success: 'Form data received and submitted successfully',
        };
        return new Response(JSON.stringify(successResponse), {
          status: 200, // OK
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      } else {
        // Handle other HTTP methods
        const errorResponse = {
          error: 'Only POST requests are supported',
        };
        return new Response(JSON.stringify(errorResponse), {
          status: 405, // Method Not Allowed
          headers: {
            'Content-Type': 'application/json',
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
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
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
  urlencoded.append("entry.1592595101", contact);
  urlencoded.append("entry.1193926513", clgName);
  urlencoded.append("entry.875091108", schoolName);
  urlencoded.append("entry.31134898", studentIdUrl);
  urlencoded.append("entry.463664041", govIdUrl);
  urlencoded.append("entry.1672731479", rNo);
  urlencoded.append("entry.335192038", ssPaymentUrl);
  urlencoded.append("entry.934455295", tId);
  urlencoded.append("entry.621779747", paymentPhone);
  urlencoded.append("entry.1182897846", gender);
  urlencoded.append("entry.316715673", studentCategory);
  urlencoded.append("entry.149016326", paymentGateway);
  urlencoded.append("entry.1989279340", runningDistance);

  const response = await fetch(formUrl, {
    method: "POST",
    body: urlencoded,
  });

  if (response.ok) {
    console.log("Form data submitted successfully to the external Google Form");
  } else {
    // console.log(await response.text());
    throw new Error("Failed to submit data to the external Google Form");
  }
}
