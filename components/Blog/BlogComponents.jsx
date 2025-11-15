"use client";
import {
  FaQuoteLeft,
  FaShareAlt,
  FaBookmark,
  FaHeart,
  FaComment,
  FaEye,
} from "react-icons/fa";

export function QuoteBlock({ quote, author, source }) {
  return (
    <div className="bg-gradient-to-r from-red-50 to-purple-50 border-l-4 border-red-500 p-6 my-8 rounded-r-lg">
      <div className="flex items-start gap-4">
        <FaQuoteLeft className="text-red-500 text-2xl mt-1 flex-shrink-0" />
        <div>
          <blockquote className="text-lg italic text-gray-800 mb-2">
            "{quote}"
          </blockquote>
          {author && (
            <cite className="text-sm text-gray-600">
              — {author}
              {source && <span className="text-red-600">, {source}</span>}
            </cite>
          )}
        </div>
      </div>
    </div>
  );
}

export function TipBox({ title, content, type = "info" }) {
  const types = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    success: "bg-green-50 border-green-200 text-green-800",
    tip: "bg-red-50 border-red-200 text-red-800",
  };

  return (
    <div className={`border-l-4 p-4 my-6 rounded-r-lg ${types[type]}`}>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm">{content}</p>
    </div>
  );
}

export function ImageGallery({ images, title }) {
  return (
    <div className="my-8">
      {title && (
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-lg"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <button className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 p-2 rounded-full transition-all duration-300">
                <FaEye className="text-gray-700" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SocialShare({ url, title }) {
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
      url
    )}&description=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
  };

  return (
    <div className="flex items-center gap-4 my-6 p-4 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium text-gray-700">Udostępnij:</span>
      <div className="flex gap-2">
        {Object.entries(shareLinks).map(([platform, link]) => (
          <a
            key={platform}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
            title={`Udostępnij na ${platform}`}
          >
            <FaShareAlt className="text-gray-600" />
          </a>
        ))}
      </div>
    </div>
  );
}

export function RelatedPosts({ posts }) {
  return (
    <div className="mt-12 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Powiązane artykuły
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post, index) => (
          <a
            key={index}
            href={`/blog/${post.url}`}
            className="block bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {post.title}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {post.shortDesc}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export function AuthorBio({ author }) {
  return (
    <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg my-8">
      <img
        src={author.avatar}
        alt={author.name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <h4 className="font-semibold text-gray-900 mb-1">{author.name}</h4>
        <p className="text-sm text-gray-600 mb-2">{author.bio}</p>
        <div className="flex gap-2">
          {author.social?.twitter && (
            <a
              href={author.social.twitter}
              className="text-red-600 hover:text-red-700"
            >
              Twitter
            </a>
          )}
          {author.social?.instagram && (
            <a
              href={author.social.instagram}
              className="text-red-600 hover:text-red-700"
            >
              Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function TableOfContents({ headings }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Spis treści</h3>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading, index) => (
            <li key={index}>
              <a
                href={`#${heading.id}`}
                className="text-blue-700 hover:text-blue-900 text-sm block py-1"
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

// Generate realistic comments data
function generateRealisticComments(postTitle = "", postContent = "") {
  const names = [
    "Agnieszka Nowak",
    "Magdalena Kowalska",
    "Katarzyna Wiśniewska",
    "Joanna Dąbrowska",
    "Anna Lewandowska",
    "Monika Zielińska",
    "Karolina Woźniak",
    "Aleksandra Kamińska",
    "Natalia Kozłowska",
    "Paulina Jankowska",
    "Weronika Mazur",
    "Justyna Krawczyk",
    "Martyna Piotrkowska",
    "Sylwia Grabowska",
    "Patrycja Pawłowska",
    "Klaudia Michalska",
    "Dominika Nowożyńska",
    "Ewelina Wróbel",
    "Izabela Jabłońska",
    "Aneta Majewska",
  ];

  const avatarColors = [
    "bg-pink-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];

  // Generate contextual comments based on post content
  const getContextualComments = () => {
    const generalComments = [
      "Świetny artykuł! Właśnie tego szukałam. Bardzo pomocne wskazówki.",
      "Bardzo przystępnie napisane! Już nie mogę się doczekać żeby wypróbować.",
      "Fantastyczny poradnik! Zgadzam się z każdym punktem.",
      "Długo szukałam takiego szczegółowego opisu. Wreszcie wszystko jasne!",
      "Super artykuł! Uwielbiam gdy ktoś wyjaśnia wszystko krok po kroku.",
      "Bardzo fajnie napisane! Polecam każdej początkującej.",
      "Cudowne zdjęcia i dokładne instrukcje. Właśnie tego potrzebowałam.",
      "Pracuję jako stylistka paznokci i zgadzam się w 100%.",
      "Bardzo pomocne wskazówki! Już wczoraj wypróbowałam i efekt jest niesamowity.",
      "Genialny poradnik! Dziękuję za podzielenie się wiedzą.",
    ];

    const hybridComments = [
      "Mam pytanie - czy te techniki sprawdzają się też na krótkich paznokciach?",
      "Miałam problem z trwałością hybryd, ale teraz wiem gdzie robiłam błędy!",
      "Czy ktoś może polecić dobrą lampę UV? Zastanawiam się nad kupnem.",
      "Nigdy nie myślałam, że przygotowanie płytki jest tak ważne.",
      "Mam wrażliwe paznokcie i zawsze się boję hybryd. Są jakieś specjalne preparaty?",
      "Które kolory polecacie na początek? Jestem nowa w hybridach.",
      "Czy wszystkie lampy LED działają tak samo? Myślę o zmianie.",
      "Informacja o usuwaniu była bardzo pomocna - zawsze się z tym męczyłam!",
    ];

    const nailArtComments = [
      "Piękne wzory! Mam nadzieję że będzie więcej o nail art dla początkujących.",
      "Te techniki zdobienia wyglądają skomplikowanie, ale spróbuję!",
      "Które pędzelki polecacie do takich wzorów?",
      "Fantastyczne inspiracje! Już wiem co zrobię na następny manicure.",
      "Te kolory są przepiękne! Gdzie można je kupić?",
    ];

    const pedicureComments = [
      "Świetne rady na pedicure! Czy te techniki działają też w domu?",
      "Mam problem ze skórkami przy paznokciach stóp - pomoże to?",
      "Bardzo potrzebowałam takich wskazówek na lato!",
      "Czy można używać tych samych produktów co do manicure?",
    ];

    const careComments = [
      "Bardzo potrzebowałam rad na pielęgnację! Moje paznokcie są słabe.",
      "Czy macie porady na paznokcie które szybko się łamią?",
      "Te olejki naprawdę działają? Który polecacie?",
      "Moja mama zawsze mówiła żeby dbać o paznokcie, ale dopiero teraz rozumiem jak.",
      "Świetne rady na wzmocnienie płytki paznokcia!",
    ];

    // Determine comment category based on title and content
    const titleLower = postTitle.toLowerCase();
    const contentLower = postContent.toLowerCase();

    let specificComments = [];
    if (titleLower.includes("hybryd") || contentLower.includes("hybryd")) {
      specificComments = hybridComments;
    } else if (
      titleLower.includes("wzor") ||
      titleLower.includes("zdobi") ||
      contentLower.includes("nail art")
    ) {
      specificComments = nailArtComments;
    } else if (
      titleLower.includes("pedicure") ||
      contentLower.includes("stopy")
    ) {
      specificComments = pedicureComments;
    } else if (
      titleLower.includes("pielęgn") ||
      contentLower.includes("olejek") ||
      contentLower.includes("wzmocn")
    ) {
      specificComments = careComments;
    }

    // Mix general and specific comments
    return [...generalComments, ...specificComments];
  };

  const comments = getContextualComments();

  const timeStamps = [
    "12 minut temu",
    "35 minut temu",
    "1 godzinę temu",
    "2 godziny temu",
    "4 godziny temu",
    "7 godzin temu",
    "1 dzień temu",
    "2 dni temu",
    "3 dni temu",
    "5 dni temu",
    "1 tydzień temu",
    "10 dni temu",
    "2 tygodnie temu",
    "3 tygodnie temu",
  ];

  // Generate 8-12 random comments with no duplicates
  const numComments = Math.floor(Math.random() * 5) + 8;
  const selectedComments = [];
  const usedNames = new Set();
  const usedComments = new Set();

  for (let i = 0; i < numComments && usedComments.size < comments.length; i++) {
    // Select unique name
    let name;
    do {
      name = names[Math.floor(Math.random() * names.length)];
    } while (usedNames.has(name) && usedNames.size < names.length);
    usedNames.add(name);

    // Select unique comment
    let comment;
    do {
      comment = comments[Math.floor(Math.random() * comments.length)];
    } while (usedComments.has(comment));
    usedComments.add(comment);

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("");
    const avatarColor =
      avatarColors[Math.floor(Math.random() * avatarColors.length)];
    const timeStamp = timeStamps[Math.floor(Math.random() * timeStamps.length)];

    // More realistic like distribution - some comments have more likes than others
    const likes =
      Math.random() > 0.3
        ? Math.floor(Math.random() * 8) + 1 // Most comments: 1-8 likes
        : Math.floor(Math.random() * 25) + 10; // Popular comments: 10-34 likes

    const hasReplies = Math.random() > 0.75; // 25% chance of having replies

    selectedComments.push({
      id: i,
      name,
      initials,
      avatarColor,
      comment,
      timeStamp,
      likes,
      hasReplies,
      replies: hasReplies
        ? generateReplies(names, avatarColors, comments, timeStamps)
        : [],
    });
  }

  return selectedComments;
}

function generateReplies(names, avatarColors, comments, timeStamps) {
  const numReplies = Math.floor(Math.random() * 3) + 1; // 1-3 replies
  const replies = [];

  const replyComments = [
    "Dokładnie! Miałam ten sam problem.",
    "Dziękuję za tip, wypróbuję!",
    "Polecam markę XYZ, świetna jakość.",
    "Ja używam tej metody od lat, naprawdę działa.",
    "Świetna rada, dzięki za podzielenie się!",
    "Mnie też się sprawdziło, polecam.",
    "Bardzo pomocne, dziękuję!",
    "Zgadzam się w 100%!",
  ];

  for (let i = 0; i < numReplies; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("");
    const avatarColor =
      avatarColors[Math.floor(Math.random() * avatarColors.length)];
    const comment =
      replyComments[Math.floor(Math.random() * replyComments.length)];
    const timeStamp = timeStamps[Math.floor(Math.random() * timeStamps.length)];
    const likes = Math.floor(Math.random() * 8) + 1;

    replies.push({
      id: `reply-${i}`,
      name,
      initials,
      avatarColor,
      comment,
      timeStamp,
      likes,
    });
  }

  return replies;
}

export function CommentSection({ postTitle = "", postContent = "" }) {
  const comments = generateRealisticComments(postTitle, postContent);

  return (
    <div className="mt-12 p-6 bg-white border border-gray-200 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Komentarze ({comments.length})
      </h3>

      {/* Comment Form */}
      <div className="mb-8">
        <textarea
          placeholder="Napisz komentarz..."
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
          rows="4"
        />
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Zaloguj się aby komentować</span>
          </div>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Opublikuj komentarz
          </button>
        </div>
      </div>

      {/* Dynamic Comments */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="border-b border-gray-200 pb-6 last:border-b-0"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div
                className={`w-10 h-10 ${comment.avatarColor} rounded-full flex items-center justify-center text-white font-semibold text-sm`}
              >
                {comment.initials}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">
                    {comment.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {comment.timeStamp}
                  </span>
                </div>

                <p className="text-gray-700 mb-3 leading-relaxed">
                  {comment.comment}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
                    <FaHeart />
                    <span>{comment.likes}</span>
                  </button>
                  <button className="hover:text-red-600 transition-colors">
                    Odpowiedz
                  </button>
                  <button className="hover:text-red-600 transition-colors">
                    <FaShareAlt />
                  </button>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 ml-6 space-y-4 border-l-2 border-gray-100 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 ${reply.avatarColor} rounded-full flex items-center justify-center text-white font-semibold text-xs`}
                        >
                          {reply.initials}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 text-sm">
                              {reply.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {reply.timeStamp}
                            </span>
                          </div>

                          <p className="text-sm text-gray-700 mb-2">
                            {reply.comment}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
                              <FaHeart />
                              <span>{reply.likes}</span>
                            </button>
                            <button className="hover:text-red-600 transition-colors">
                              Odpowiedz
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Comments */}
      <div className="mt-6 text-center">
        <button className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors">
          Pokaż więcej komentarzy
        </button>
      </div>
    </div>
  );
}

export function ProgressBar() {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div
        className="h-full bg-red-500 transition-all duration-300"
        style={{ width: "0%" }}
      />
    </div>
  );
}
