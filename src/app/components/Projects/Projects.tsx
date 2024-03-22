import styles from "./Projects.module.css";

export const Projects = () => {
  return (
    <div className={styles.container}>
      <h3>@ Pluralsight</h3>
      <h4>FinTech Support Tooling - Technical Lead</h4>
      <p>
        A comprehensive set of tools built in NextJS to provide an interface to
        manage Pluralsight B2B Subscriptions, scan 100k accounts for issues, and
        provide non technical stakeholders with the ability to correct issues.
      </p>
      <p>
        This has saved hundreds of hours of developer time, and allowed the
        FinTech team to focus on bigger picture problems, instead of manually
        correcting issues with accounts. During this I also mentored
        developers and encouraged them to help make technical decisions for this
        internal project. This has put the team in a much better place, and
        helped other developers take ownership of various parts of the project.
      </p>

      <h4>Entitlements - Technical Lead</h4>
      <p>
        A complete rewrite of the Pluralsight B2B provisioning engine. Written
        in NestJS and designed to provide a simple but powerful interface for
        salesforce to update the Pluralsight platform asynchronously with
        changes, including but not limited to self healing APIs, developer
        tools, automated subscription updates, error detection and auto
        correction.
      </p>
      <p>
        A major design goal was ease of diagnosis and fast remediation of
        issues. Because of the outlined goals we could remediate any B2B issue,
        for any account, within hours of a report. The application was powerful,
        but accessible to all parties who would need to interact with those
        systems. It provided extremely powerful B2B Provisioning tools, with a
        dead simple interface.
      </p>
      <p>
        As the technical lead on this project I integrated with Kafka, RabbitMQ,
        and various internal Pluralsight systems to fully provision any B2B
        customer.
      </p>
      <h4>B2B Mass provisioning and remediation tools</h4>
      <p>
        A Series of internal scripts designed to allow mass creation of B2B
        accounts to facilitate large acquisitions and migration of external
        business accounts to be in alignment with all required Pluralsight
        Objects.
      </p>
      <p>
        This allowed over 10k B2B accounts to be created en-mass as part of a
        migration effort.
      </p>
      <h4>Acquisition Migration(ACG)</h4>
      <p>
        I worked to create migrations scripts to assist with the Pluralsight
        purchase of A Cloud Guru to create all necessary objects in Zuora,
        Salesforce, Stripe and beyond migrating from Chargebee, to ensure that
        all credit cards, accounts, and subscription terms were preserved from
        system to system.
      </p>
      <p>
        I was also tasked to project manage the technical requirements, worked to create a
        roadmap and plan for each step of the process and update management with
        expected timelines, working with multi functional teams around
        Pluralsight to ensure that all requirements were met.
      </p>
    </div>
  );
};
