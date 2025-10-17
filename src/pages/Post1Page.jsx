import React from "react";
import Navbar from "../Navbar";
import "../mainstyle.css";
import { Link } from "react-router-dom";
import imgCramp from '../Images/cramp.jpg';

const Post1Page = () => (
  <>
    <Navbar />
    <main className="blog-container section-container fade-in">
      <h1 className="blog-title">Understanding Period Cramps: Why They Happen and How to Feel Better</h1>
      <div className="blog-image">
        <img src={imgCramp} alt="Healthcare Innovation" />
      </div>
      <article className="blog-content">
        <p><strong>Published on:</strong> March 20, 2025 | <strong>By:</strong> Dr. Rochana Acharya</p>
        <h1>🌸 Period Pain? You're Not Alone! 🌸</h1>
        <p>
          Did you know that <strong>45% to 95%</strong> of girls and women who have periods experience period pain?
          So if you feel cramps in your lower belly during your periods, you are definitely not alone!
          This kind of pain usually starts on the first day of your period and can last up to 2 or 3 days.
          Some girls also feel pain in their lower back or thighs.
        </p>
        <p>
          But it's not just about cramps. During your period, you might feel tired, have a headache,
          feel nauseous (like you want to throw up), have loose stools, or notice mood swings like feeling
          irritated, sad, or anxious. These are common and normal, so don't worry—you are not alone in feeling this way.
        </p>
        <h2> Why Does This Happen?</h2>
        <p>
          During your period, the lining of your uterus (womb) breaks down and comes out as period blood.
          To push it out, your uterus squeezes or cramps. That squeezing is what causes the pain.
          Your body also makes natural chemicals called <strong>prostaglandins</strong> to help with this process.
          But sometimes, your body makes too much of it, and the squeezing gets stronger, causing more pain.
          Hormone changes during your period can also make you feel more emotional.
        </p>
        <h2> How Do You Know If It's Normal Pain?</h2>
        <p>This normal period pain is called <strong>primary dysmenorrhea</strong>. You can recognize it because:</p>
        <ul>
          <li>It usually starts a year or two after your first period.</li>
          <li>It happens during your periods and gets better after 2 or 3 days.</li>
          <li>There's no other health problem causing it.</li>
          <li>It often improves as you get older or after having a baby.</li>
        </ul>
        <h2> What Can You Do to Feel Better?</h2>
        <p>The good news is there are simple ways to manage the pain!</p>
        <ul>
          <li>Put a warm cloth or heating pad on your lower belly.</li>
          <li>Do some light exercise like walking or stretching.</li>
          <li>Relax and rest when you need to.</li>
          <li>Pain relief medicines like ibuprofen can help. They work by reducing prostaglandins,
            the chemical that causes strong cramps. These medicines are safe when used correctly—they won't
            mess up your future periods or health. That's why it's important to follow the right dose,
            and your doctor can help with that.</li>
        </ul>
        <blockquote>
          So next time your belly hurts during your period, remember—you understand what's happening, and you've got ways to handle it! 🌸💪
        </blockquote>
        <div className="blog-footer">
          <Link to="/" className="btn primary-btn">← Back to Posts</Link>
        </div>
      </article>
    </main>
    <footer className="site-footer" style={{ background: "#f8f8f8", color: "#333", textAlign: "center", padding: "1.2rem 0", marginTop: "2rem", fontSize: "1rem", borderTop: "1px solid #eee" }}>
      <span>&copy; 2024 Namaste Doctor. All rights reserved. | <Link to="/privacy-policy" style={{ color: "#1976d2", textDecoration: "underline" }}>Privacy Policy</Link></span>
    </footer>
  </>
);

export default Post1Page; 