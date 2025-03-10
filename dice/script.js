document.addEventListener('DOMContentLoaded', () => {
    const die = document.getElementById('die');
    let isRolling = false;

    // Define rotations for each face
    const rotations = [
        { x: 0, y: 0, z: 0 },         // 1 (front)
        { x: 0, y: 180, z: 0 },       // 6 (back)
        { x: 0, y: 90, z: 0 },        // 3 (right)
        { x: 0, y: -90, z: 0 },       // 4 (left)
        { x: 90, y: 0, z: 0 },        // 2 (top)
        { x: -90, y: 0, z: 0 }        // 5 (bottom)
    ];

    // Function to roll the die
    function rollDie() {
        if (isRolling) return;
        isRolling = true;

        // Add rolling animation
        die.classList.add('rolling');

        // After animation completes, show random face
        setTimeout(() => {
            die.classList.remove('rolling');
            
            // Get random face (0-5)
            const randomFace = Math.floor(Math.random() * 6);
            const rotation = rotations[randomFace];
            
            // Apply rotation to show the random face
            die.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`;
            
            // Allow rolling again after a short delay
            setTimeout(() => {
                isRolling = false;
            }, 500);
        }, 1500);
    }

    // Event listener for clicking the die
    die.addEventListener('click', rollDie);

    // For PowerPoint compatibility - also listen for pointer events
    die.addEventListener('pointerdown', rollDie);

    // Fix for some PowerPoint versions - listen for mousedown
    die.addEventListener('mousedown', rollDie);

    // Make sure the die is clickable in PowerPoint
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});
