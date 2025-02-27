const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'awards', 'experience', 'publications'];


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }

            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
            }).then(() => {
                // MathJax
                MathJax.typeset();
            })
            .catch(error => console.log(error));
    })

     // 简历下载功能
     const resumeDownload = document.getElementById('resume-download');
     if (resumeDownload) {
         resumeDownload.addEventListener('click', function () {
             this.href ='static/assets/downloads/resume.pdf';
         });
     }
 
     // 论文下载功能
     const publicationsDownload = document.getElementById('publications-download');
     if (publicationsDownload) {
         publicationsDownload.addEventListener('click', function () {
             const paperLinks = document.querySelectorAll('#publications-md a');
             if (paperLinks.length === 0) {
                 alert('未找到可下载的论文');
                 return;
             }
             const firstPaperLink = paperLinks[0];
             if (firstPaperLink) {
                 window.location.href = firstPaperLink.href;
             }
         });
     }
 
     // 单独论文下载功能
     fetch(content_dir + 'publications.md')
       .then(response => response.text())
       .then(markdown => {
             const html = marked.parse(markdown);
             const publicationsMd = document.getElementById('publications-md');
             publicationsMd.innerHTML = html;
             const paperLinks = publicationsMd.querySelectorAll('a');
             paperLinks.forEach(link => {
                 const href = link.href;
                 link.href = href;
                 link.download = link.textContent;
             });
         })
       .then(() => {
             MathJax.typeset();
         })
       .catch(error => console.log(error));

}); 
