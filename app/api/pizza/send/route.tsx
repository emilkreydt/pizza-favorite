import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { renderToBuffer } from "@react-pdf/renderer";
import { PizzaPDF } from "@/app/lib/pdf/PizzaPDF";

/**
 * Handles POST requests to send a personalized pizza recommendation email with a PDF attachment.
 *
 * @param {Request} req - The incoming HTTP request containing user pizza preferences.
 * @returns {Promise<NextResponse>} - A JSON response indicating success or failure.
 */
export async function POST(req: Request) {
  const data = await req.json();
  const { email, kaas, vlees, groente } = data;

  /**
   * A map of pizza names to their corresponding Cloudinary image URLs.
   * @type {Record<string, string>}
   */
  const imageMap: Record<string, string> = {
    "Pizza Margherita":
      "https://res.cloudinary.com/dwbpcbxjk/image/upload/v1749651370/avatars/sttf95uyi12gxofxklq3.jpg",
    "Pizza Pepperoni":
      "https://res.cloudinary.com/dwbpcbxjk/image/upload/v1749652206/avatars/sdm9b9v3ut0nzqfh5qp0.jpg",
    "Pizza Hawaii":
      "https://res.cloudinary.com/dwbpcbxjk/image/upload/v1749650530/avatars/ymphdbi8s7wrvsafi3hu.jpg",
    "Pizza Barbecue Chicken":
      "https://res.cloudinary.com/dwbpcbxjk/image/upload/v1749650227/avatars/dwv7goadobz8rno5oebu.jpg",
    "Pizza Vegetariana":
      "https://res.cloudinary.com/dwbpcbxjk/image/upload/v1749654299/avatars/mh4udiwjdte0zpsghdah.jpg",
  };

  console.log("SMTP debug:", process.env.SMTP_USER, process.env.SMTP_PASS);

  /**
   * Determines the best pizza based on ingredient preferences using a scoring system.
   * @param {string} kaas - Cheese preference
   * @param {string} vlees - Meat preference
   * @param {string} groente - Vegetable preference
   * @returns {string} - The selected pizza name
   */
  function determinePizza(
    kaas: string,
    vlees: string,
    groente: string
  ): string {
    const scores: Record<string, number> = {
      "Pizza Margherita": 0,
      "Pizza Pepperoni": 0,
      "Pizza Hawaii": 0,
      "Pizza Barbecue Chicken": 0,
      "Pizza Vegetariana": 0,
    };

    if (kaas === "Heel veel") {
      scores["Pizza Margherita"] += 2;
      scores["Pizza Pepperoni"] += 1;
      scores["Pizza Vegetariana"] += 1;
    } else if (kaas === "Normaal") {
      scores["Pizza Margherita"] += 1;
    }

    if (vlees === "Ja, pepperoni") {
      scores["Pizza Pepperoni"] += 3;
    } else if (vlees === "Ja, kip") {
      scores["Pizza Barbecue Chicken"] += 3;
    } else if (vlees === "Nee") {
      scores["Pizza Vegetariana"] += 2;
    }

    if (groente === "Ananas") {
      scores["Pizza Hawaii"] += 3;
    } else if (
      groente === "Paprika" ||
      groente === "Ui" ||
      groente === "Olijven"
    ) {
      scores["Pizza Vegetariana"] += 2;
    } else if (groente !== "Geen") {
      scores["Pizza Vegetariana"] += 1;
    }

    scores["Pizza Margherita"] += 0.5;

    const bestPizza = Object.entries(scores).reduce((a, b) =>
      b[1] > a[1] ? b : a
    )[0];

    return bestPizza;
  }

  /**
   * A map of pizza names to their descriptive text.
   * @type {Record<string, string>}
   */
  const descriptionMap: Record<string, string> = {
    "Pizza Margherita":
      "Een klassieke pizza met tomaat, mozzarella en basilicum. Eenvoudig, vers en heerlijk.",
    "Pizza Pepperoni":
      "Een pittige favoriet met gesmolten kaas en royale plakjes pepperoni.",
    "Pizza Hawaii":
      "Een tropische mix van ananas en ham – zoet en hartig in balans.",
    "Pizza Barbecue Chicken":
      "Rijke barbecuesaus, sappige kip en een rokerige twist.",
    "Pizza Vegetariana":
      "Volop verse groenten zoals paprika, ui, champignons en olijven.",
  };

  /**
   * Renders a PDF buffer containing the pizza information.
   * @type {Buffer}
   */

  const pizza = determinePizza(kaas, vlees, groente);

  const pdfBuffer = await renderToBuffer(
    <PizzaPDF
      pizzaName={pizza}
      description={descriptionMap[pizza]}
      imageUrl={imageMap[pizza]}
    />
  );

  /**
   * The plain text message included in the email.
   * @type {string}
   */
  const message = `
Hallo!

Gebaseerd op je antwoorden, is jouw ideale pizza: ${pizza} 

Zie de bijlage voor meer info. Eet smakelijk!
  `;

  /**
   * Creates and configures a Nodemailer transporter.
   * @type {import("nodemailer").Transporter}
   */
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Pizza Quiz" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Jouw perfecte pizza: ${pizza}`,
      text: message,
      attachments: [
        {
          filename: `${pizza.replace(/\s/g, "_")}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log(" Sending email to:", email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mail fout:", error);
    return NextResponse.json(
      { error: "Kon e-mail niet versturen" },
      { status: 500 }
    );
  }
}
