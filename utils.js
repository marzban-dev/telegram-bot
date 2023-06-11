const { Duration } = require("luxon");
const axios = require("axios").default;
const path = require("path");
const fs = require("fs");

exports.getImages = async (params = { count: 6 }) => {
    const options = {
        method: "GET",
        url: " https://api.unsplash.com/photos/random",
        params: params,
        headers: {
            Authorization: "Client-ID qeTYKPHLaR41i_cnMRRqkPM002n_c8upwbWBVJSEcQg",
        },
    };

    try {
        const { data } = await axios.request(options);
        return data.map((img) => ({
            id: img.id,
            description: img.description,
            url: img.urls.small,
        }));
    } catch (e) {
        console.log(e);
    }
};

exports.searchImages = async (query, count = 6) => {
    const options = {
        method: "GET",
        url: " https://api.unsplash.com/search/photos",
        params: {
            query,
            page: 1,
            per_page: count,
        },
        headers: {
            Authorization: "Client-ID qeTYKPHLaR41i_cnMRRqkPM002n_c8upwbWBVJSEcQg",
        },
    };

    try {
        const { data } = await axios.request(options);
        return data.results.map((img) => ({
            id: img.id,
            description: img.description,
            url: img.urls.small,
        }));
    } catch (e) {
        console.log(e);
    }
};

exports.downloadFile = async (fileUrl, downloadFolder) => {
    // Get the file name
    const fileName = path.basename(fileUrl);

    // The path of the downloaded file on our machine
    const localFilePath = path.resolve(__dirname, downloadFolder, fileName);
    try {
        const response = await axios({
            method: "GET",
            url: fileUrl,
            responseType: "stream",
        });

        const w = response.data.pipe(fs.createWriteStream(localFilePath));
        w.on("finish", () => {
            console.log("Successfully downloaded file!");
        });
    } catch (err) {
        throw new Error(err);
    }
};

exports.CalculateRemainingTime = (createdDate, completionDate) => {
    const currentDate = Date.now();

    let _creationDate;
    if (createdDate instanceof Date) _creationDate = createdDate.getTime();
    else _creationDate = new Date(createdDate).getTime();

    let _completionDate;
    if (completionDate instanceof Date) _completionDate = completionDate.getTime();
    else _completionDate = new Date(completionDate).getTime();

    const readableDate = {};

    const duration = Duration.fromMillis(_completionDate - currentDate)
        .shiftTo("years", "months", "days", "hours", "minutes", "seconds", "milliseconds")
        .toObject();

    if (duration.years !== 0) readableDate["years"] = Math.abs(duration.years);
    if (duration.months !== 0) readableDate["months"] = Math.abs(duration.months);
    if (duration.days !== 0) readableDate["days"] = Math.abs(duration.days);
    if (duration.hours !== 0) readableDate["hours"] = Math.abs(duration.hours);
    if (duration.minutes !== 0) readableDate["minutes"] = Math.abs(duration.minutes);
    readableDate["seconds"] = Math.abs(duration.seconds);

    return readableDate;
};

exports.Health = () => {
    const endDate = new Date("March 21, 2040").getTime() / 1000 / 60 / 60 / 24 / 365;
    const currentDate = new Date().getTime() / 1000 / 60 / 60 / 24 / 365;

    const progress = Array.from({ length: Math.floor(endDate - currentDate) })
        .map(() => "=")
        .join("");
    const fullProgress = Array.from({ length: 25 }).map(() => "-");
    fullProgress.splice(0, progress.length);
    return "Israel Health [" + progress + fullProgress.join("") + "]";
};
