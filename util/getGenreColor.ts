const colors = ["#6DC086", "#E3BD71", "#E86491", "#7B7BF0"];

export const getGenreColor = (genre: string): string => {
    let hash = 0;
    for (let i = 0; i < genre.length; i++) {
        hash = genre.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}