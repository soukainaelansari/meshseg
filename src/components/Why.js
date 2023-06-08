import meter1 from "../assets/img/upload.png";
import meter2 from "../assets/img/user-friendly.png";
import meter3 from "../assets/img/image_2023-06-08_212726600-removebg-preview.png";
import meter4 from "../assets/img/1584849.png";
import meter5 from "../assets/img/9876324.png";
import meter6 from "../assets/img/hands.png";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import arrow1 from "../assets/img/arrow1.svg";
import arrow2 from "../assets/img/arrow2.svg";
import colorSharp from "../assets/img/color-sharp.png"

export const Why = () => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <section className="skill" id="whytoothseg">
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="skill-bx wow zoomIn">
                        <h2>Why TeethSeg</h2>
                        <p>Teeth Segmentation Service by TeethSeg Highest Degree of Efficiency and Accuracy.</p>
                        <Carousel responsive={responsive} infinite={true} className="owl-carousel owl-theme skill-slider">
                            <div className="item1">
                                <img src={meter1} alt="Image" />
                                <h5>Web-based</h5>
                                <p>Obtain a smooth and ultra-fast performance with our solution that doesn't rely on cloud computing! For best outcomes, access it through Google Chrome on a computer equipped with a GPU..</p>
                            </div>
                            <div className="item1">
                                <img src={meter2} alt="Image" />
                                <h5>User-friendly</h5>
                                <p>Discover the cutting-edge of Teeth segmentation through our radiologist-designed, user-friendly tool. Enjoy streamlined workflows and enhanced precision thanks to our gaming-inspired controls and radiology expertise.</p>
                            </div>
                            <div className="item1">
                                <img src={meter3} alt="Image" />
                                <h5>3D</h5>
                                <p>TeethSeg offers advanced 3D dental segmentation functionalities. This allows users to obtain accurate and detailed results for their three-dimensional dental models.</p>
                            </div>
                            <div className="item1">
                                <img src={meter4} alt="Image" />
                                <h5>Time-saving</h5>
                                <p>With TeethSeg, you can save valuable time in your dental workflow. Our automated end-to-end 3D teeth segmentation approach eliminates the need for manual segmentation, which can be time-consuming and prone to errors.</p>
                            </div>
                            <div className="item1">
                                <img src={meter5} alt="Image" />
                                <h5>Continuous Improvement</h5>
                                <p>At TeethSeg, we are committed to continuous improvement and innovation. We regularly update our algorithms and features to ensure the highest accuracy and efficiency in teeth segmentation. By choosing TeethSeg, you benefit from ongoing advancements in the field, keeping you at the forefront of dental technology.</p>
                            </div>
                            <div className="item1">
                                <img src={meter6} alt="Image" />
                                <h5>Exceptional Support</h5>
                                <p>We pride ourselves on providing exceptional customer support. Our team is dedicated to assisting you throughout your TeethSeg experience, addressing any questions or concerns you may have. We value your feedback and strive to deliver a seamless and satisfactory user experience.</p>
                            </div>
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
        <img className="background-image-left" src={colorSharp} alt="Image" />
    </section>
  )
}
