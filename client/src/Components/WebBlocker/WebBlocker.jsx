// import React, { useState } from 'react';
// import './WebBlocker.scss'
// const fs = require('fs');

// const WebBlocker = () => {

//   const filePath = "C:\\Windows\\System32\\drivers\\etc\\hosts";
//   const redirectPath = "127.0.0.1";

//   // List of websities to be blocked
//   let websites = ["www.facebook.com", "facebook.com"];

//   let delay = 2000; // 2 seconds

//   let blocker = () => {
//     let date = new Date();
//     let hours = date.getHours();
//     if (hours >= 14 && hours < 18) {
//       console.log('Time to block websites');
//       fs.readFile(filePath, (err, data) => {
//         // Throw error in case something went wrong!
//         if (err) {
//           return console.log(err);
//         }

//         // Convert the fetched data to string
//         const fileContents = data.toString();

//         /**
//          * Check whether each website in the list exist in the list, 
//          * If it exists, ignore,
//          * else, write the websites and redirect address in the file
//          */
//         for (let i = 0; i < websites.length; i++) {
//           let addWebsite = "\n" + redirectPath + " " + websites[i];
//           if (fileContents.indexOf(addWebsite) < 0) {
//             console.log('Website: ' + addWebsite + ' is not present');
//             fs.appendFile(filePath, addWebsite, (err) => {
//               if (err) {
//                 return console.log('Error: ', err);
//               }
//               console.log('File Updated Successfully');
//             });
//           } else {
//             console.log('Website: ' + addWebsite + ' is present');
//           }
//         }

//       });
//     } else {
//       console.log('Time to unblock websites');

//       /**
//        * Declare and empty string, 
//        * We will keep on appending the lines which do not contain our websites to this string
//        * At the end, we will replace the file contents by this string
//        */
//       let completeContent = '';

//       // Read  file line by line
//       fs.readFileSync(filePath)
//         .toString()
//         .split('\n')
//         .forEach((line) => {
//           // console.log(line);
//           let flag = 1;
//           // Loop through each website from website list
//           for (let i = 0; i < websites.length; i++) {
//             // Check whether the current line contains any blocked website
//             if (line.indexOf(websites[i]) >= 0) {
//               flag = 0;
//               break;
//             }
//           }

//           if (flag === 1) {
//             if (line === '')
//               completeContent += line;
//             else
//               completeContent += line + "\n";
//           }

//         });

//       // Replace the contents of file by completeContent
//       fs.writeFile(filePath, completeContent, (err) => {
//         if (err) {
//           return console.log('Error!', err);
//         }
//       });
//     }
//   };

//   blocker();
//   // The script should run until closed explicitly
//   setInterval(blocker, delay);

//   return (
//     <div>
//       {/* <h1>Social Media Blocker</h1>
//       <input
//         type="text"
//         placeholder="Enter a social media site (e.g., facebook.com)"
//         value={siteToAdd}
//         onChange={(e) => setSiteToAdd(e.target.value)}
//       />
//       <button onClick={handleAddSite}>Add Site</button>
//       <ul>
//         {blockedSites.map((site) => (
//           <li key={site}>
//             {site} <button onClick={() => handleRemoveSite(site)}>Remove</button>
//           </li>
//         ))}
//       </ul> */}
//     </div>
//   );

// }

// export default WebBlocker

