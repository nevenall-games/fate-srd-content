(function () {

  'use strict';

  var gulp = require('gulp');
  var replace = require('gulp-replace');
  var markdown = require('gulp-markdown');
  var prettify = require('gulp-prettify');
  var dest = require('gulp-dest');
  var exec = require('child_process').exec;

  var match;

  gulp.task('md', function () {
    return gulp.src('docs/markdown/**.md')
      .pipe(markdown())
      .pipe(gulp.dest('docs/html'));
  });

  gulp.task('pandoc', function (cb) {
    exec('pandoc -s -S docs/markdown/atomic-robo-SRD.md -o docs/word/atomic-robo-SRD.docx');
    exec('pandoc -s -S docs/markdown/fate-accelerated-SRD.md -o docs/word/fate-accelerated-SRD.docx');
    exec('pandoc -s -S docs/markdown/fate-core-SRD.md -o docs/word/fate-core-SRD.docx');
    exec('pandoc -s -S docs/markdown/fate-system-toolkit-SRD.md -o docs/word/fate-system-toolkit-SRD.docx');
    exec('pandoc -s -S docs/markdown/frontier-spirit.md -o docs/word/frontier-spirit.docx');
    exec('pandoc -s -S docs/markdown/gods-and-monsters-SRD.md -o docs/word/gods-and-monsters-SRD.docx');
    exec('pandoc -s -S docs/markdown/sails-full-of-stars-SRD.md -o docs/word/sails-full-of-stars-SRD.docx');
    exec('pandoc -s -S docs/markdown/three-rocketeers-fate-conspiracies-SRD.md -o docs/word/three-rocketeers-fate-conspiracies-SRD.docx');
    exec('pandoc -s -S docs/markdown/three-rocketeers-no-skill-swashbuckling-SRD.md -o docs/word/three-rocketeers-no-skill-swashbuckling-SRD.docx');
    exec('pandoc -s -S docs/markdown/venture-city.md -o docs/word/venture-city.docx');
  })

  gulp.task('replace-fate-more', function(){
    gulp.src([
      'source/atomic-robo-SRD.html',
      'source/frontier-spirit.html',
      'source/gods-and-monsters-SRD.html',
      'source/sails-full-of-stars-SRD.html',
      'source/three-rocketeers-fate-conspiracies-SRD.html',
      'source/three-rocketeers-no-skill-swashbuckling-SRD.html',
      'source/venture-city.html'
      ])
      // Remove specific cases (sometimes this is easier than figuring out regexp)
      .pipe(replace('<a href="NoSkill.html#_idTextAnchor002">page&#160;8</a>','page 8'))
      .pipe(replace('<!DOCTYPE html>',''))
      .pipe(replace('<html xmlns="http://www.w3.org/1999/xhtml">',''))
      .pipe(replace('<head>',''))
      .pipe(replace('</head>',''))
      .pipe(replace('<meta charset="utf-8" />',''))
      .pipe(replace(/<title>((.)*?)<\/title>/g,''))
      .pipe(replace(/<body id="(NoSkill|FrontierSpirit|Fate_Conspiracies|Sails_Full_of_Stars_SRD|GodsSRD|Open_Source_Chunk)" lang="en-US">/g,''))
      .pipe(replace(/<link href="((.)*?).css" rel="stylesheet" type="text\/css" \/>/g,''))
      .pipe(replace('xml:lang="en-US" xmlns:xml="http://www.w3.org/XML/1998/namespace"',''))

      // Formating
      .pipe(replace('<p class="Heading-1">','\n# '))
      .pipe(replace('<p class="CC-BY_Heading-1">','\n# '))
      .pipe(replace('<p class="Heading-2">','\n## '))
      .pipe(replace('<p class="CC-BY_Heading-2">','\n## '))
      .pipe(replace('<p class="Heading-3">','\n### '))
      .pipe(replace('<p class="CC-BY_Heading-3">','\n### '))
      .pipe(replace('<p class="Heading-3 ParaOverride-1">','\n### '))
      .pipe(replace('<p class="Heading-4">','\n#### '))
      .pipe(replace('<p class="OGL_Heading-4">','\n#### '))
      .pipe(replace('<p class="CC-BY_Heading-4">','\n#### '))
      .pipe(replace('<p class="Heading-5">','\n##### '))
      .pipe(replace('<p class="CC-BY_Heading-5">','\n##### '))
      .pipe(replace('<p class="Example-start">','\n block> '))
      .pipe(replace('<p class="Example-end">','\n block> '))
      .pipe(replace('<p class="Example-middle">','\n block> '))
      .pipe(replace('<p class="Example">','\n block> '))
      
      .pipe(replace(/<\s*li[^>]*>(.*?)<\s*\/\s*li>/g, '- $1'))
      .pipe(replace(/^-../g,'- '))
      .pipe(replace(/<span class="Emphasis">((.|\n)*?)<\/span>/gi,'<em>$1<\/em>'))
      .pipe(replace(/<span class="Strong">((.|\n)*?)<\/span>/gi,'<strong>$1<\/strong>'))
      .pipe(replace(/<span class="CC-BY_Strong">((.|\n)*?)<\/span>/gi,'<strong>$1<\/strong>'))
      .pipe(replace(/<span class="Book-Title">((.|\n)*?)<\/span>/gi,'<em>$1<\/em>'))
      .pipe(replace(/<span class="Term">((.|\n)*?)<\/span>/gi,'<em>$1<\/em>'))
      .pipe(replace(/<span class="CC-BY_Term">((.|\n)*?)<\/span>/gi,'<em>$1<\/em>'))
      .pipe(replace(/<span class="Book-Title">((.|\n)*?)<\/span>/gi,'<em>$1<\/em>'))
      .pipe(replace(/<span class="Aspect">((.|\n)*?)<\/span>/gi,'<aspect>$1<\/aspect>'))
      .pipe(replace('&nbsp;',' '))

      // Remove id and style
      .pipe(replace(/(id|style)=\"(.*?)\"/g, ''))

      // Remove unique elements in core file
      .pipe(replace(/ char-style-override-(\d)/g,''))

      // Remove anchors
      .pipe(replace(/<a id="((.|\n|)*?)"><\/a>/g,'foo'))
      .pipe(replace(/<a href="#((.|\n)*?)">((.|\n)*?)<\/a>/g,''))

      // Remove class and ids
      .pipe(replace(/(class)=\"(.*?)\"/g, ''))
      // Remove extra spaces caused from removing classes and ids
      .pipe(replace(/\s*>/g,'>'))
      // Remove empty <span>
      .pipe(replace(/<span>((.|\n)*?)<\/span>/gi,'$1'))

      .pipe(replace('<ul>',''))
      .pipe(replace('</ul>',''))
      .pipe(replace('<a></a>',''))

      .pipe(replace(/<h[123456]>/g, function(match, offset, string){
        switch(match) {
          case '<h1>':
            return '# '
            break;
          case '<h2>':
            return '## '
            break;
          case '<h3>':
            return '### '
            break;
          case '<h4>':
            return '#### '
            break;
          case '<h5>':
            return '##### '
            break;
          case '<h6>':
            return '###### '
            break;
          default:
            console.log('Criteria not met')
        }
      }))
      .pipe(replace(/<\/h[123456]>/g, function(match, offset, string){
        switch(match) {
          case '</h1>':
          case '</h2>':
          case '</h3>':
          case '</h4>':
          case '</h5>':
          case '</h6>':
            return ''
          default:
            console.log('Criteria not met')
        }
      }))
      
      // Remove elements
      .pipe(replace('<p>','\n'))
      .pipe(replace('</p>',''))
      .pipe(replace(/<div((.|\n)*?)>/gi,''))
      .pipe(replace('</div>',''))
      .pipe(replace('</body>',''))
      .pipe(replace('</html>',''))
      .pipe(replace('<br/>',''))
      .pipe(replace('<br />',''))

      // Remove extra space at the start of a line.
      .pipe(replace(/\t*/g, ''))
      .pipe(replace(/  +?/g, ' '))
      .pipe(replace(/  +?/g, ' '))
      .pipe(replace(/  +?/g, ' '))
      .pipe(replace(/\n /g,'\n'))

      // Add aspect class
      .pipe(replace(/<aspect>((.|\n)*?)<\/aspect>/gi,'<span class="aspect">$1<\/span>'))
      
      // Fix blockquotes
      .pipe(replace('block> ','> '))
      
      // Fix errors
      .pipe(replace('</span><span class="aspect">',''))
      .pipe(replace('</strong><strong>',''))
      .pipe(replace('</em><em>',''))
      .pipe(replace('<hr />',''))

      // Clean up newlines
      .pipe(replace(/\n\n\n/g, '\n\n'))
      .pipe(replace(/\n\n\n/g, '\n\n'))
      .pipe(replace(/\n\n\n/g, '\n\n'))
      .pipe(replace(/\n\n\n/g, '\n\n'))
      .pipe(replace(/\n\n\n/g, '\n\n'))
      .pipe(replace(/\n\n\n/g, '\n\n'))


      // Put output in markdown folder
      .pipe(dest('docs/markdown', {ext: '.md'}))
      .pipe(gulp.dest('./'));
  });

  gulp.task('replace', function(){
    gulp.src([
      'source/fate-accelerated-SRD.html',
      'source/fate-core-SRD.html',
      'source/fate-system-toolkit-SRD.html'
      ])

      // Remove styles
      .pipe(replace(/(style)=\"(.*?)\"/g, ''))
      .pipe(replace(/(id)=\"(.*?)\"/g, ''))
      .pipe(replace(/char-style-override-\d*/g, ''))
      .pipe(replace('class="Normal"', ''))
      .pipe(replace('class="Normal-First"', ''))
      .pipe(replace(/ para-style-override-\d/g, ''))

      // Remove extra spaces caused from removing classes and ids
      .pipe(replace(/\s*>/g, '>'))
      .pipe(replace(/ "/g, '"'))

      // Convert &nbsp;
      .pipe(replace('&nbsp;',' '))

      // Convert
      .pipe(replace(/<span class="Emphasis">((.|\n)*?)<\/span>/gi,'<em>$1<\/em>'))
      .pipe(replace(/<span class="Term">((.|\n)*?)<\/span>/gi,'$1'))
      .pipe(replace(/<span class="Strong">((.|\n)*?)<\/span>/gi,'<strong>$1</strong>'))
      .pipe(replace(/<span class="Book-Title">((.|\n)*?)<\/span>/gi,'<em>$1</em>'))
      .pipe(replace(/<span class="Chapter">((.|\n)*?)<\/span>/gi,'$1'))
      .pipe(replace(/<\s*li[^>]*>(.*?)<\s*\/\s*li>/g, '- $1'))
      .pipe(replace(/<i>/g, '<em>'))
      .pipe(replace(/<\/i>/g, '</em>'))
      .pipe(replace(/<b>/g, '<strong>'))
      .pipe(replace(/<\/b>/g, '</strong>'))
      .pipe(replace(/class="Aspect"/gi, 'class="aspect"'))
      .pipe(replace(/<p class="Example">/g, '> '))
      .pipe(replace(/<p class="Sidebar-Header">/gi, '> ## '))
      .pipe(replace(/<p class="Sidebar-Body-First">/gi, '> '))
      .pipe(replace(/<p class="Sidebar-Body">/gi, '> '))
      .pipe(replace(/<li>/gi, '- '))
      .pipe(replace(/<\/strong>\n/g, '</strong> '))
      .pipe(replace(/## <strong>((.|\n)*?)<\/strong>/gi, '## $1'))


      // .pipe(replace(/<span class="Strong">((.|\n)*?)<\/span>/gi,'<strong>$1<\/strong>'))
      // .pipe(replace(/<span class="Term char-style-override-\d*" style=\"(.*?)\">((.|\n)*?)<\/span>/gi,'<strong class="convert">$2</strong>'))
      // <span class="Strong" style="font-weight: bold;">Situation Aspects:</span>
      // <span class="Term char-style-override-9" style="font-weight: bold;">aspect</span>
      
      // // Remove id, style, and class
      // .pipe(replace(/(id|style)=\"(.*?)\"/g, ''))
      // .pipe(replace(/(class)=\"(.*?)\"/g, ''))
      
      
      
      // // Remove empty <span>
      // .pipe(replace(/<span>((.|\n)*?)<\/span>/gi,'$1'))
      
      
      
      // // Remove anchors
      // .pipe(replace(/<a id="((.|\n|)*?)">((.|\n)*?)<\/a>/g,'$2'))
      // .pipe(replace(/<a href="#(.*)-(.)*?">((.|\n)*?)<\/a>/g,'$2'))
      // .pipe(replace(/<a href="#(.*)">((.|\n)*?)<\/a>/g,'$2'))

      // // Convert lists to markdown
      

      // Format headers
      .pipe(replace(/ class="Heading-\d"/g, ''))
      .pipe(replace(/<h[123456]>/g, function(match, offset, string){
        switch(match) {
          case '<h1>':
            return '# '
            break;
          case '<h2>':
            return '## '
            break;
          case '<h3>':
            return '### '
            break;
          case '<h4>':
            return '#### '
            break;
          case '<h5>':
            return '##### '
            break;
          case '<h6>':
            return '###### '
            break;
          default:
            console.log('Criteria not met')
        }
      }))
      .pipe(replace(/<\/h[123456]>/g, function(match, offset, string){
        switch(match) {
          case '</h1>':
          case '</h2>':
          case '</h3>':
          case '</h4>':
          case '</h5>':
          case '</h6>':
            return ''
          default:
            console.log('Criteria not met')
        }
      }))

      // // Remove elements
      .pipe(replace('<p>','\n'))
      .pipe(replace('</p>',''))
      // .pipe(replace(/<a>/g, ''))
      // .pipe(replace(/<\/a>/g, ''))
      .pipe(replace('<a></a>',''))
      .pipe(replace(/<div((.|\n)*?)>/gi,''))
      .pipe(replace('</div>',''))
      .pipe(replace('<ul>',''))
      .pipe(replace('</ul>',''))
      .pipe(replace('<br/>',''))
      .pipe(replace('<br />',''))
      .pipe(replace('<br class="Apple-interchange-newline" />',''))
      .pipe(replace(/<a href="#Anchor-\d*">((.|\n)*?)<\/a>/g, '$1'))
      .pipe(replace(/<span class="Become-Running-Footer-Text">((.|\n)*?)<\/span>/g, '$1'))
      .pipe(replace('<span> </span>', ''))
      .pipe(replace(/<p class="Inline-Header--ih-">/g, ''))
      .pipe(replace(/<hr \/>/, ''))
      

      // Remove extra space at the start of a line.
      .pipe(replace(/\t*/g, ''))
      .pipe(replace(/  +?/g, ' '))
      .pipe(replace(/  +?/g, ' '))
      .pipe(replace(/  +?/g, ' '))
      .pipe(replace(/\n /g, '\n'))
      .pipe(replace(/# \n/g, '# '))

      // // // Add aspect class
      // // .pipe(replace(/<aspect>((.|\n)*?)<\/aspect>/gi,'<span class="aspect">$1<\/span>'))
      
      // // // Fix blockquotes
      // // .pipe(replace('block> ','> '))
    
      // Clean up newlines
      .pipe(replace(/\n\n\n/g, '\n\n'))
      .pipe(replace(/\n\n\n/g, '\n\n'))
      .pipe(replace(/\n\n\n/g, '\n\n'))
      .pipe(replace(/\n\n\n/g, '\n\n'))
      .pipe(replace(/\n\n\n/g, '\n\n'))
      .pipe(replace(/\n\n\n/g, '\n\n'))

      // Put output in markdown folder
      .pipe(dest('docs/markdown', {ext: '.md'}))
      .pipe(gulp.dest('./'));
    });

})();
