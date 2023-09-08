/**
 * Assignment 7
 */

/** Load the list of albums */

// Source: https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
function formatSeconds(seconds){return(seconds-(seconds%=60))/60+(9<seconds?':':':0')+seconds}

async function listAlbums(){
    let reply = await fetch("/albums");
    if (reply.status == 200){
        let result = await reply.json();
        let list = document.getElementById("album_list");
        for(data in result) {
            let liEl = document.createElement("li");
            let aEl = document.createElement("a")
            aEl.innerText = `${result[data].artist} - ${result[data].album}`
            aEl.className = result[data].album_id;
            aEl.addEventListener("click", () => {
                showAlbum(aEl.className);
            })
            liEl.appendChild(aEl);
            list.append(liEl);
        }
    }
}

/** Show details of a given album */
async function showAlbum(album_id) {

    let albumCoverEl = document.getElementById("album_cover");

    let divEl = document.getElementById("album_info");
    let divTableEl = document.getElementById("album_songs");
    let tableEl = document.createElement("table");
    let theadEl = document.createElement("thead");
    let tbodyEl = document.createElement("tbody");

    let row1 = document.createElement("tr");
    let heading1 = document.createElement("th"); 
    heading1.innerHTML = "No.";
    let heading2 = document.createElement("th"); 
    heading2.innerHTML = "Title";
    let heading3 = document.createElement("th"); 
    heading3.innerHTML = "Length";

    row1.appendChild(heading1);
    row1.appendChild(heading2);
    row1.appendChild(heading3);
    theadEl.appendChild(row1);

    totalLength = 0

    
    let url = "/albuminfo?album_id="+album_id;
    let response = await fetch(url);
    if(response.status == 200) {
        const content = await response.json();

        cover = content["cover"];
        let imgEl = document.createElement("img");
        imgEl.src = "static/images/"+cover;
        albumCoverEl.innerHTML = "";
        albumCoverEl.appendChild(imgEl);
        
        for(let i = 0;i<content["tracks"].length;i++) {
            track_length = (content["tracks"][i]["length"].split(":"));
            totalLength += parseInt(track_length[0])*60 + parseInt(track_length[1]);
            
            let row = document.createElement("tr");
            let row_data1 = document.createElement("td");
            row_data1.className = "song_no";
            row_data1.innerHTML = `${i+1}.`;
            let row_data2 = document.createElement("td");
            row_data2.className = "song_title";
            row_data2.innerHTML = content["tracks"][i]["track"];;
            let row_data3 = document.createElement("td");
            row_data3.className = "song_length";
            row_data3.innerHTML = content["tracks"][i]["length"];

            row.appendChild(row_data1);
            row.appendChild(row_data2);
            row.appendChild(row_data3);
            tbodyEl.appendChild(row);


        }

        let row2 = document.createElement("tr");
        let row2_data1 = document.createElement("td");
        row2_data1.setAttribute("colspan","2")
        row2_data1.innerHTML = "<span style='font-weight:bold'>Total length</span>";
        let row2_data2 = document.createElement("td");
        row2_data2.innerHTML = "";
        let row2_data3 = document.createElement("td");
        row2_data3.innerHTML = `<span style="font-weight:bold">${formatSeconds(totalLength)}</span>`;
        
        row2.appendChild(row2_data1);
        row2.appendChild(row2_data2);
        row2.appendChild(row2_data3);
        tbodyEl.appendChild(row2);

        divTableEl.innerHTML = "";
        tableEl.appendChild(theadEl);
        tableEl.appendChild(tbodyEl);
        divTableEl.appendChild(tableEl);
        divEl.appendChild(divTableEl);
    }
}