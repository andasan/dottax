import { randomUUID } from "crypto";

/**
 * This file is used to seed your development database.
 * This data is not loaded in your tests.
 *
 *
 *  id          Int         @id @default(autoincrement())
 *  name        String
 *  email       String      @unique
 *  password    String
 *  studentId   String      @unique
 *  createdAt   DateTime    @default(now())
 *  updatedAt   DateTime    @updatedAt
 */

// export const students = [
//   {
//     studentId: "1",
//     name: "Leanne Graham",
//     email: "Sincere@april.biz",
//     password: randomUUID()
//   },
//   {
//     studentId: "2",
//     name: "Ervin Howell",
//     email: "Shanna@melissa.tv",
//     password: randomUUID()
//   },
//   {
//     studentId: "3",
//     name: "Clementine Bauch",
//     email: "Nathan@yesenia.net",
//     password: randomUUID()
//   },
//   {
//     studentId: "4",
//     name: "Patricia Lebsack",
//     email: "Julianne.OConner@kory.org",
//     password: randomUUID()
//   },
//   {
//     studentId: "5",
//     name: "Chelsey Dietrich",
//     email: "Lucio_Hettinger@annie.ca",
//     password: randomUUID()
//   },
//   {
//     studentId: "6",
//     name: "Mrs. Dennis Schulist",
//     email: "Karley_Dach@jasper.info",
//     password: randomUUID()
//   },
//   {
//     studentId: "7",
//     name: "Kurtis Weissnat",
//     email: "Telly.Hoeger@billy.biz",
//     password: randomUUID()
//   },
//   {
//     studentId: "8",
//     name: "Nicholas Runolfsdottir V",
//     email: "Sherwood@rosamond.me",
//     password: randomUUID()
//   },
//   {
//     studentId: "9",
//     name: "Glenna Reichert",
//     email: "Chaim_McDermott@dana.io",
//     password: randomUUID()
//   },
//   {
//     studentId: "10",
//     name: "Clementina DuBuque",
//     email: "Rey.Padberg@karina.biz",
//     password: randomUUID()
//   }
// ];

export const students = async () => {
  return await fetch("https://randomuser.me/api/?results=30")
    .then(response => response.json())
    .then(data => {
      const students = data.results.map((student: any) => {
        return {
          studentId: randomUUID(),
          name: `${student.name.first} ${student.name.last}`,
          email: student.email,
        }
      })
      return students
    });
}

export const emailTemplates = {
  header: "Tuition Enrolment Certificate (T2202)",
  body: `<p><em>Do Not Reply. This is an automated email using a third-party secure portal.</em></p><p>Hello Student,</p><p>Please find attached your confidential tax form.</p><p>Your tax form contains sensitive personal information. Download it using a trusted, secure connection instead of over free, public wi-fi, such as at airports or coffee shops, etc.</p><p>If you need assistance to file your tax, please contact our preferred partner, Phoenix Accounting Services: <a target="_blank" rel="noopener noreferrer nofollow" href="https://phoenixcanada.ca/file-your-taxes">https://phoenixcanada.ca/file-your-taxes</a></p><p>Thank you</p>`,
  footer: "© 2023 Cornerstone International College of Canada 609 West Hastings St, Vancouver, BC, Canada V6B 4W4",
}
