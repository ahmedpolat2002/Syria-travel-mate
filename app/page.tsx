import Homepage from "@/pages/Homepage/Homepage";

/*
export default function Page() { // edit
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [safetyStatus, setSafetyStatus] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setMessage("Please select an image.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("safetyStatus", safetyStatus);
    formData.append("image", image);

    try {
      console.log("Submitting form data");
      const res = await fetch("/api/provinces", {
        method: "POST",
        body: formData,
      });
      console.log("end form data");

      const data = await res.json();

      if (res.ok) {
        setMessage("Province added successfully.");
        setName("");
        setDescription("");
        setSafetyStatus("");
        setImage(null);
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded max-w-md"
    >
      <h2 className="text-xl font-bold">Add Province</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Safety Status"
        value={safetyStatus}
        onChange={(e) => setSafetyStatus(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="w-full"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Province"}
      </button>

      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
}
*/

export const metadata = {
  title: "Homepage",
  description: "Welcome to the homepage of our application.",
};

export default function Page() {
  return (
    <div>
      <Homepage />
    </div>
  );
}
