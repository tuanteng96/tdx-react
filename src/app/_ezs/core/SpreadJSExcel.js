var sv = "https://cser.vn/admin/SpreadJSExcelIO/13/";

function loadResource() {
    return new Promise((rs) => {
        var link = document.createElement("link");
        link.href = `${sv}gc.spread.sheets.excel2016colorful.13.2.2.mode.css`;
        link.rel = "stylesheet";
        link.onload = () => {
            var s1 = document.createElement("script");
            s1.src = `${sv}gc.spread.sheets.all.13.2.2.min.mod.js?t=1`;

            var n = 0;

            s1.onload = () => {
                [
                    `${sv}gc.spread.sheets.print.13.2.2.min.js?t=1`,
                    `${sv}FileSaver.min.js?t=1`,
                    `${sv}gc.spread.excelio.13.2.2.min.js?t=1`,
                ].forEach((src) => {
                    var s1 = document.createElement("script");
                    s1.src = src;
                    s1.onload = () => {
                        n++;
                        if (n == 3) {
                            rs();
                        }
                    };
                    document.head.appendChild(s1);
                });
            };
            document.head.appendChild(s1);
        };
        document.head.appendChild(link);
    });
}

function dataToExcel(fileName, fn) {
    //1. Chuẩn bị xuất
    var excelIO = new window.GC.Spread.Excel.IO();
    var el = document.getElementById("ex");
    if (!el) {
        el = document.createElement("div");
        el.id = "ex";
        el.style.position = "fixed";
        el.style.bottom = 0;
        el.style.left = 0;
        el.style.width = 1;
        el.style.height = 1;
        el.style.overflow = "hidden";
        el.style.visibility = "hidden";
        document.body.appendChild(el);
    }
    var inner = document.querySelector(".inner");
    if (!inner) {
        inner = document.createElement("div");
        el.style.width = "100vw";
        el.style.height = "100vh";
        el.appendChild(inner);
    }
    var workbook = new window.GC.Spread.Sheets.Workbook(inner);
    var sheet = workbook.getActiveSheet();

    sheet.setRowCount(300000);
    sheet.setColumnCount(50);

    fn(sheet, workbook);

    //3. Xuất
    var json = JSON.stringify(workbook.toJSON());
    excelIO.save(
        json,
        function(blob) {
            window.saveAs && window.saveAs(blob, fileName || "ezs.xlsx"); //xlsx
        },
        function(e) {
            console.log(e);
        }
    );
}

export { loadResource, dataToExcel }