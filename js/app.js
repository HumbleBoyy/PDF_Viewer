const url = '../docs/pdf.pdf';

let pdfDoc = null,
pageNum = 1,
pageIsRendering = false,
pageNumIsPending = null;


const scale = 1.5,
canvas = document.querySelector('#pdf-render'),
ctx = canvas.getContext('2d');


// Render the page
const renderPage = num => {
    pageIsRendering = true;
  
    // Get page
    pdfDoc.getPage(num).then(page => {
      // Set scale
      const viewport = page.getViewport({ scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
  
      const renderCtx = {
        canvasContext: ctx,
        viewport
      };
  
      page.render(renderCtx).promise.then(() => {
        pageIsRendering = false;
  
        if (pageNumIsPending !== null) {
          renderPage(pageNumIsPending);
          pageNumIsPending = null;
        }
      });
  
      // Output current page
      document.querySelector('#page_num').textContent = num;
    });
  };

// Check for pages Rendering
const queueRenderingPage = num => {
    if(pageIsRendering) {
        pageNumIsPending = num;
    }else{
        renderPage(num);
    }
}
  
// Show Previous Page
const showPrevPage = () => {
    if(pageNum <= 1){
        return
    }

    pageNum --;
    queueRenderingPage(pageNum);
}

// Show Next Page
const showNextPage = () => {
    if(pageNum >= pdfDoc.numPages){
        return;
    }

    pageNum ++;
    queueRenderingPage(pageNum);
}


// Get Document
pdfjsLib
  .getDocument(url)
  .promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;

    document.querySelector('#page_count').textContent = pdfDoc.numPages;

    renderPage(pageNum);
})
.catch((err)=> {
    // Display Error
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div, canvas)
    // Remove top bar
    document.querySelector('.top_bar').style.display = 'none'
})

// Button events
document.querySelector('#prev_page').addEventListener('click', showPrevPage)
document.querySelector('#next_page').addEventListener('click', showNextPage)